# escritorios/audit_serializers.py
from rest_framework import serializers
from .audit_models import AuditLog, AuditLogRetencao


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer para logs de auditoria."""
    
    usuario_completo = serializers.SerializerMethodField()
    acao_display = serializers.CharField(source='get_acao_display', read_only=True)
    diferencas = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'timestamp', 'usuario_nome', 'usuario_completo',
            'escritorio_nome', 'acao', 'acao_display', 'descricao',
            'modelo_nome', 'objeto_repr', 'endpoint', 'metodo_http',
            'ip_address', 'user_agent', 'dados_antigos', 'dados_novos',
            'campos_alterados', 'diferencas', 'sucesso', 'erro_mensagem'
        ]
        read_only_fields = fields
    
    def get_usuario_completo(self, obj):
        """Retorna informações completas do usuário se disponível."""
        if obj.usuario:
            return {
                'id': obj.usuario.id,
                'username': obj.usuario.username,
                'nome': obj.usuario.get_full_name() or obj.usuario.username,
                'email': obj.usuario.email,
            }
        return {'nome': obj.usuario_nome}
    
    def get_diferencas(self, obj):
        """Retorna lista formatada de diferenças."""
        return obj.get_diferenca_campos()


class AuditLogListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem (performance)."""
    
    acao_display = serializers.CharField(source='get_acao_display', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'timestamp', 'usuario_nome', 'acao', 'acao_display',
            'descricao', 'modelo_nome', 'objeto_repr', 'sucesso'
        ]
        read_only_fields = fields


class AuditLogRetencaoSerializer(serializers.ModelSerializer):
    """Serializer para configuração de retenção."""
    
    class Meta:
        model = AuditLogRetencao
        fields = [
            'escritorio', 'dias_retencao', 'habilitar_log_leitura',
            'habilitar_exportacao_automatica'
        ]
        read_only_fields = ['escritorio']
