# escritorios/audit_middleware.py
"""
Middleware de Auditoria
Intercepta requisições e registra automaticamente ações no AuditLog.
"""

from django.utils.deprecation import MiddlewareMixin
from django.contrib.contenttypes.models import ContentType
from .audit_models import AuditLog
import json
import re


def get_client_ip(request):
    """Obtém o IP real do cliente."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class AuditMiddleware(MiddlewareMixin):
    """
    Middleware que registra automaticamente ações dos usuários.
    
    Regras:
    - Só registra usuários autenticados
    - Ignora rotas de autenticação e admin
    - Ignora GET (leitura) por padrão, a menos que habilitado
    - Captura CREATE (POST), UPDATE (PUT/PATCH), DELETE
    """
    
    # Endpoints que devem ser ignorados
    IGNORE_PATHS = [
        r'^/admin/',
        r'^/api/auth/',
        r'^/api/meu-escritorio/$',  # Ignora view própria (muito frequente)
        r'^/static/',
        r'^/media/',
        r'^/api/audit-logs/',  # Não audita consultas de auditoria
    ]
    
    # Mapeamento de método HTTP para ação
    METHOD_TO_ACTION = {
        'POST': 'CREATE',
        'PUT': 'UPDATE',
        'PATCH': 'UPDATE',
        'DELETE': 'DELETE',
        'GET': 'VIEW',
    }
    
    def process_request(self, request):
        """Armazena dados iniciais da requisição."""
        request._audit_start_time = None
        
        # Verifica se deve auditar esta requisição
        if not self._should_audit(request):
            return None
        
        # Armazena dados iniciais se for UPDATE ou DELETE
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            request._audit_old_data = self._get_object_data(request)
        
        return None
    
    def process_response(self, request, response):
        """Registra a ação após a resposta."""
        
        # Verifica se deve auditar
        if not self._should_audit(request):
            return response
        
        # Só registra se a resposta foi sucesso (2xx ou 3xx)
        if not (200 <= response.status_code < 400):
            return response
        
        # Cria o log de auditoria
        try:
            self._create_audit_log(request, response)
        except Exception as e:
            # Não deve quebrar a requisição se auditoria falhar
            print(f"Erro ao criar audit log: {e}")
        
        return response
    
    def _should_audit(self, request):
        """Verifica se a requisição deve ser auditada."""
        
        # Ignora se usuário não autenticado
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return False
        
        # Ignora se não tem perfil
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Ignora paths configurados
        for pattern in self.IGNORE_PATHS:
            if re.match(pattern, request.path):
                return False
        
        # Verifica se deve auditar GET (leitura)
        if request.method == 'GET':
            escritorio = request.user.perfil.escritorio
            if escritorio and hasattr(escritorio, 'config_auditoria'):
                return escritorio.config_auditoria.habilitar_log_leitura
            return False  # Por padrão, não audita GET
        
        # Audita POST, PUT, PATCH, DELETE
        return request.method in ['POST', 'PUT', 'PATCH', 'DELETE']
    
    def _create_audit_log(self, request, response):
        """Cria o registro de auditoria."""
        
        usuario = request.user
        acao = self.METHOD_TO_ACTION.get(request.method, 'VIEW')
        
        # Extrai informações do objeto afetado
        objeto = self._get_affected_object(request, response)
        descricao = self._generate_description(request, acao, objeto)
        
        # Prepara dados do log
        log_data = {
            'usuario': usuario,
            'acao': acao,
            'descricao': descricao,
            'endpoint': request.path,
            'metodo_http': request.method,
            'ip_address': get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', '')[:500],
            'sucesso': True,
        }
        
        # Adiciona objeto se identificado
        if objeto:
            log_data['objeto'] = objeto
        
        # Adiciona dados antigos (para UPDATE/DELETE)
        if hasattr(request, '_audit_old_data'):
            log_data['dados_antigos'] = request._audit_old_data
        
        # Adiciona dados novos (para CREATE/UPDATE)
        if acao in ['CREATE', 'UPDATE']:
            log_data['dados_novos'] = self._get_object_data_from_response(response)
        
        # Calcula campos alterados (para UPDATE)
        if acao == 'UPDATE' and hasattr(request, '_audit_old_data'):
            log_data['campos_alterados'] = self._get_changed_fields(
                request._audit_old_data,
                log_data.get('dados_novos', {})
            )
        
        # Cria o log
        AuditLog.criar_log(**log_data)
    
    def _get_affected_object(self, request, response):
        """Tenta identificar o objeto afetado pela requisição."""
        try:
            # Tenta extrair do path (ex: /api/clientes/123/)
            match = re.search(r'/api/(\w+)/(\d+)', request.path)
            if match:
                model_name = match.group(1).rstrip('s')  # Remove 's' do plural
                object_id = match.group(2)
                
                # Mapeamento de endpoints para models
                model_mapping = {
                    'cliente': 'clientes.Cliente',
                    'consulta': 'consultas.Consulta',
                    'analise': 'analises.AnaliseIA',
                    'papel': 'escritorios.Papel',
                }
                
                model_path = model_mapping.get(model_name)
                if model_path:
                    app_label, model = model_path.split('.')
                    content_type = ContentType.objects.get(
                        app_label=app_label,
                        model=model.lower()
                    )
                    model_class = content_type.model_class()
                    return model_class.objects.get(pk=object_id)
        except Exception:
            pass
        
        return None
    
    def _get_object_data(self, request):
        """Obtém dados do objeto antes da modificação."""
        try:
            obj = self._get_affected_object(request, None)
            if obj:
                # Serializa campos importantes do objeto
                data = {}
                for field in obj._meta.fields:
                    field_name = field.name
                    value = getattr(obj, field_name, None)
                    
                    # Converte para tipos serializáveis
                    if hasattr(value, 'isoformat'):  # datetime
                        value = value.isoformat()
                    elif hasattr(value, 'id'):  # ForeignKey
                        value = value.id
                    
                    data[field_name] = str(value) if value is not None else None
                
                return data
        except Exception:
            pass
        
        return {}
    
    def _get_object_data_from_response(self, response):
        """Extrai dados do objeto da resposta."""
        try:
            if hasattr(response, 'data') and isinstance(response.data, dict):
                # Remove campos não relevantes
                data = {k: v for k, v in response.data.items() 
                       if k not in ['escritorio', 'membros']}
                return data
        except Exception:
            pass
        
        return {}
    
    def _get_changed_fields(self, old_data, new_data):
        """Identifica quais campos foram alterados."""
        changed = []
        
        for key in old_data.keys():
            old_value = str(old_data.get(key))
            new_value = str(new_data.get(key))
            
            if old_value != new_value:
                changed.append(key)
        
        return changed
    
    def _generate_description(self, request, acao, objeto):
        """Gera descrição amigável da ação."""
        
        acao_map = {
            'CREATE': 'criou',
            'UPDATE': 'editou',
            'DELETE': 'excluiu',
            'VIEW': 'visualizou',
        }
        
        verbo = acao_map.get(acao, 'acessou')
        
        if objeto:
            modelo = objeto.__class__.__name__
            return f"{verbo} {modelo}: {str(objeto)}"
        
        # Descrição genérica baseada no endpoint
        path_parts = request.path.split('/')
        if len(path_parts) > 2:
            recurso = path_parts[2].replace('-', ' ').title()
            return f"{verbo} {recurso}"
        
        return f"{verbo} recurso"
