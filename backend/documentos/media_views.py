"""
View customizada para servir arquivos de mídia sem X-Frame-Options
"""

from django.http import FileResponse, Http404
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
import os


@xframe_options_exempt
@require_http_methods(["GET", "HEAD"])
def serve_media(request, path):
    """
    Serve arquivos de mídia sem X-Frame-Options header
    Permite visualização em iframes
    """
    # Constrói o caminho completo do arquivo
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    
    # Verifica se o arquivo existe
    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        raise Http404("Arquivo não encontrado")
    
    # Verifica se o caminho está dentro de MEDIA_ROOT (segurança)
    real_path = os.path.realpath(file_path)
    real_media_root = os.path.realpath(settings.MEDIA_ROOT)
    if not real_path.startswith(real_media_root):
        raise Http404("Acesso negado")
    
    # Abre e retorna o arquivo
    try:
        file_handle = open(file_path, 'rb')
        response = FileResponse(file_handle)
        
        # Define o Content-Type baseado na extensão
        extension = os.path.splitext(path)[1].lower()
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
        
        if extension in content_types:
            response['Content-Type'] = content_types[extension]
        
        # NÃO adiciona Content-Disposition para permitir visualização inline
        # response['Content-Disposition'] = f'inline; filename="{os.path.basename(path)}"'
        
        return response
    except Exception as e:
        raise Http404(f"Erro ao servir arquivo: {str(e)}")
