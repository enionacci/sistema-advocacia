"""
View customizada para servir arquivos de mídia sem X-Frame-Options
"""

from django.http import FileResponse, Http404
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
import mimetypes


@xframe_options_exempt
@csrf_exempt
@require_http_methods(["GET", "HEAD"])
def serve_media(request, path):
    """
    Serve arquivos de mídia sem X-Frame-Options header
    Permite visualização em iframes e com CORS
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # Django já decodifica a URL, não precisamos fazer unquote
    logger.info(f"📥 Requisição de media: {path}")
    logger.info(f"   User-Agent: {request.META.get('HTTP_USER_AGENT', 'Unknown')[:50]}")
    
    # Constrói o caminho completo do arquivo
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    logger.info(f"   Path completo: {file_path}")
    logger.info(f"   Arquivo existe? {os.path.exists(file_path)}")
    
    # Verifica se o arquivo existe
    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        logger.error(f"❌ Arquivo não encontrado: {file_path}")
        
        # Tenta listar o diretório para debug
        dir_path = os.path.dirname(file_path)
        if os.path.exists(dir_path):
            files = os.listdir(dir_path)
            logger.error(f"   Arquivos disponíveis: {files}")
        else:
            logger.error(f"   Diretório não existe: {dir_path}")
        
        raise Http404("Arquivo não encontrado")
    
    # Verifica se o caminho está dentro de MEDIA_ROOT (segurança)
    real_path = os.path.realpath(file_path)
    real_media_root = os.path.realpath(settings.MEDIA_ROOT)
    if not real_path.startswith(real_media_root):
        raise Http404("Acesso negado")
    
    # Abre e retorna o arquivo
    try:
        file_handle = open(file_path, 'rb')
        
        # Determina o Content-Type
        extension = os.path.splitext(path)[1].lower()
        content_type, _ = mimetypes.guess_type(file_path)
        
        if not content_type:
            content_types = {
                '.pdf': 'application/pdf',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.xls': 'application/vnd.ms-excel',
                '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                '.txt': 'text/plain',
            }
            content_type = content_types.get(extension, 'application/octet-stream')
        
        response = FileResponse(file_handle, content_type=content_type)
        
        # Headers para CORS e visualização inline
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response['Cross-Origin-Resource-Policy'] = 'cross-origin'
        
        # Para PDFs, garantir que seja inline
        if extension == '.pdf':
            response['Content-Disposition'] = f'inline; filename="{os.path.basename(path)}"'
            response['Accept-Ranges'] = 'bytes'
            logger.info(f"✅ Servindo PDF: {os.path.basename(path)} ({content_type})")
        else:
            logger.info(f"✅ Servindo {extension}: {os.path.basename(path)} ({content_type})")
        
        return response
    except Exception as e:
        logger.error(f"❌ Erro ao servir arquivo: {str(e)}")
        raise Http404(f"Erro ao servir arquivo: {str(e)}")
