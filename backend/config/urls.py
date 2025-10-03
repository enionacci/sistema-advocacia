# config/urls.py

from django.contrib import admin
from django.urls import path, include # Adicione 'include'
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('clientes.urls')), # Adicione esta linha
    path('api/', include('consultas.urls')),
    path('api/', include('analises.urls')),
    path('api/', include('escritorios.urls')),

    # URLs de Autenticação geradas pelo Djoser
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api-auth/', include('rest_framework.urls')),
    
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)