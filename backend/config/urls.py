# config/urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from documentos.media_views import serve_media

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('clientes.urls')),
    path('api/', include('consultas.urls')),
    path('api/', include('analises.urls')),
    path('api/', include('escritorios.urls')),
    path('api/audit-logs/', include('escritorios.audit_urls')),  # URLs de auditoria
    path('api/documentos/', include('documentos.urls')),  # URLs de documentos
    path('api/processos/', include('processos.urls')),  # URLs de processos

    # URLs de Autenticação geradas pelo Djoser
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api-auth/', include('rest_framework.urls')),
    
    # Serve arquivos de mídia sem X-Frame-Options
    re_path(r'^media/(?P<path>.*)$', serve_media, name='media'),
]

# Não precisa mais do static() pois estamos usando view customizada
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)