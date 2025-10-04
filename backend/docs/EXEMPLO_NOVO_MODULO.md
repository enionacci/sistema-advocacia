# 🚀 Exemplo Prático: Adicionando Módulo de Documentos

## Passo a Passo Completo

### 1️⃣ Definir Permissões (permissions_registry.py)

```python
# ==================== DOCUMENTOS ====================
DOCUMENTOS = [
    PermissionDefinition(
        codename='ver_documento',
        nome='Ver Documento',
        categoria='Documentos',
        descricao='Permite visualizar documentos'
    ),
    PermissionDefinition(
        codename='criar_documento',
        nome='Criar Documento',
        categoria='Documentos',
        descricao='Permite fazer upload de novos documentos'
    ),
    PermissionDefinition(
        codename='editar_documento',
        nome='Editar Documento',
        categoria='Documentos',
        descricao='Permite editar metadados de documentos'
    ),
    PermissionDefinition(
        codename='deletar_documento',
        nome='Deletar Documento',
        categoria='Documentos',
        descricao='Permite remover documentos'
    ),
    PermissionDefinition(
        codename='download_documento',
        nome='Download Documento',
        categoria='Documentos',
        descricao='Permite fazer download de documentos'
    ),
]

# Adicione ao método get_all_permissions()
@classmethod
def get_all_permissions(cls) -> List[PermissionDefinition]:
    return (
        cls.CLIENTES +
        cls.CONSULTAS +
        cls.ANALISES +
        cls.GERENCIAMENTO +
        cls.FINANCEIRO +
        cls.PROCESSOS +
        cls.DOCUMENTOS  # <-- ADICIONE AQUI
    )

# Adicione ao método get_permissions_by_category()
@classmethod
def get_permissions_by_category(cls) -> Dict[str, List[PermissionDefinition]]:
    return {
        'Clientes': cls.CLIENTES,
        'Consultas': cls.CONSULTAS,
        'Análises': cls.ANALISES,
        'Gerenciamento': cls.GERENCIAMENTO,
        'Financeiro': cls.FINANCEIRO,
        'Processos': cls.PROCESSOS,
        'Documentos': cls.DOCUMENTOS,  # <-- ADICIONE AQUI
    }
```

### 2️⃣ Sincronizar com Banco

```bash
python manage.py sync_permissions
```

Saída esperada:
```
✅ Permissão criada: ver_documento - Ver Documento
✅ Permissão criada: criar_documento - Criar Documento
✅ Permissão criada: editar_documento - Editar Documento
✅ Permissão criada: deletar_documento - Deletar Documento
✅ Permissão criada: download_documento - Download Documento
```

### 3️⃣ Criar o Model (documentos/models.py)

```python
from django.db import models
from clientes.models import Cliente
from escritorios.models import Escritorio

class Documento(models.Model):
    TIPO_DOCUMENTO = (
        ('contrato', 'Contrato'),
        ('procuracao', 'Procuração'),
        ('peticao', 'Petição'),
        ('sentenca', 'Sentença'),
        ('outro', 'Outro'),
    )
    
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_DOCUMENTO)
    arquivo = models.FileField(upload_to='documentos/')
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='documentos')
    escritorio = models.ForeignKey(Escritorio, on_delete=models.CASCADE)
    data_upload = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-data_upload']
```

### 4️⃣ Criar Views com Permissões (documentos/views.py)

```python
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from escritorios.permissions import HasPermission, require_permission
from .models import Documento
from .serializers import DocumentoSerializer

class DocumentoListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentoSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    
    def check_permissions(self, request):
        """Define permissão baseada no método HTTP"""
        if request.method == 'POST':
            self.required_permission = 'criar_documento'
        else:
            self.required_permission = 'ver_documento'
        super().check_permissions(request)
    
    def get_queryset(self):
        """Retorna apenas documentos do escritório do usuário"""
        return Documento.objects.filter(
            escritorio=self.request.user.perfil.escritorio
        )
    
    def perform_create(self, serializer):
        """Associa o documento ao escritório do usuário"""
        serializer.save(escritorio=self.request.user.perfil.escritorio)


class DocumentoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentoSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    
    def check_permissions(self, request):
        """Define permissão baseada no método HTTP"""
        if request.method in ['PUT', 'PATCH']:
            self.required_permission = 'editar_documento'
        elif request.method == 'DELETE':
            self.required_permission = 'deletar_documento'
        else:
            self.required_permission = 'ver_documento'
        super().check_permissions(request)
    
    def get_queryset(self):
        """Garante isolamento entre escritórios"""
        return Documento.objects.filter(
            escritorio=self.request.user.perfil.escritorio
        )


class DocumentoDownloadView(generics.RetrieveAPIView):
    """View para download de documentos"""
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'download_documento'
    
    def get_queryset(self):
        return Documento.objects.filter(
            escritorio=self.request.user.perfil.escritorio
        )
    
    @require_permission('download_documento')
    def retrieve(self, request, *args, **kwargs):
        """Retorna o arquivo para download"""
        documento = self.get_object()
        # Lógica de download aqui
        return Response({
            'url': documento.arquivo.url,
            'nome': documento.titulo
        })
```

### 5️⃣ Criar URLs (documentos/urls.py)

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.DocumentoListCreateView.as_view(), name='documento-list-create'),
    path('<int:pk>/', views.DocumentoDetailView.as_view(), name='documento-detail'),
    path('<int:pk>/download/', views.DocumentoDownloadView.as_view(), name='documento-download'),
]
```

### 6️⃣ Registrar URLs no projeto (config/urls.py)

```python
urlpatterns = [
    # ... outras URLs
    path('api/documentos/', include('documentos.urls')),
]
```

### 7️⃣ Adicionar aos Papéis Padrão (permissions_registry.py)

```python
@classmethod
def get_default_role_permissions(cls) -> Dict[str, List[str]]:
    return {
        'Administrador': [perm.codename for perm in cls.get_all_permissions()],
        'Advogado': [
            'ver_cliente', 'criar_cliente', 'editar_cliente',
            'ver_consulta', 'criar_consulta', 'editar_consulta',
            'ver_analise', 'criar_analise', 'editar_analise',
            'ver_processo', 'criar_processo', 'editar_processo',
            'ver_documento', 'criar_documento', 'editar_documento', 'download_documento',  # <-- NOVO
            'ver_relatorios',
        ],
        'Secretária': [
            'ver_cliente', 'criar_cliente', 'editar_cliente',
            'ver_consulta', 'criar_consulta',
            'ver_processo', 'criar_processo',
            'ver_documento', 'criar_documento', 'download_documento',  # <-- NOVO
        ],
        # ... outros papéis
    }
```

### 8️⃣ Testar no Frontend (DocumentListPage.js)

```javascript
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

function DocumentListPage() {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await axiosInstance.get('/api/documentos/');
                setDocumentos(response.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('Você não tem permissão para ver documentos');
                } else {
                    setError('Erro ao carregar documentos');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDocumentos();
    }, []);

    const handleDownload = async (documentoId) => {
        try {
            const response = await axiosInstance.get(`/api/documentos/${documentoId}/download/`);
            window.open(response.data.url, '_blank');
        } catch (err) {
            if (err.response?.status === 403) {
                alert('Você não tem permissão para fazer download de documentos');
            } else {
                alert('Erro ao fazer download');
            }
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Documentos</h1>
            {documentos.map(doc => (
                <div key={doc.id}>
                    <h3>{doc.titulo}</h3>
                    <button onClick={() => handleDownload(doc.id)}>
                        Download
                    </button>
                </div>
            ))}
        </div>
    );
}
```

---

## ✅ Checklist Final

- [x] Permissões definidas no registry
- [x] Comando sync_permissions executado
- [x] Models criados
- [x] Views com permission_classes configuradas
- [x] URLs registradas
- [x] Papéis padrão atualizados
- [x] Frontend com tratamento de erro 403
- [x] Testado com usuário sem permissão
- [x] Testado com usuário com permissão

---

## 🎯 Resultado

**Tempo total:** ~15 minutos  
**Linhas de código:** ~200 linhas  
**Permissões automatizadas:** ✅  
**Sistema seguro:** ✅  
**Escalável:** ✅  

---

**Pronto! Módulo completo com controle de permissões em 15 minutos!** 🚀
