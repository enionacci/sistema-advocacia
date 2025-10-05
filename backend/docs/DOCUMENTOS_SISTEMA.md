# Sistema de Gerenciamento de Documentos

## Visão Geral

O Sistema de Gerenciamento de Documentos foi desenvolvido para permitir o upload, organização e acesso fácil a documentos vinculados aos clientes. Este sistema facilita a gestão de documentos em processos jurídicos.

## Data de Implementação

**Data:** Dezembro 2024  
**Versão:** 1.0  
**Status:** Completo (Fase 1 + Fase 2)

---

## Funcionalidades Implementadas

### 📁 **Backend (Django)**

#### 1. **Models** (`documentos/models.py`)

##### **Categoria**
- `nome`: Nome da categoria (ex: Contratos, Procurações, Petições)
- `icone`: Nome do ícone Material-UI (ex: Description, Gavel)
- `cor`: Cor em hexadecimal (ex: #1976d2)
- `ordem`: Ordem de exibição
- `ativo`: Flag para soft delete
- `escritorio`: FK para multi-tenant

**Categorias Padrão Criadas:**
1. Contratos (azul)
2. Procurações (vermelho)
3. Petições (roxo)
4. Documentos Pessoais (verde)
5. Decisões Judiciais (laranja)
6. Correspondências (azul claro)
7. Comprovantes (marrom)
8. Laudos e Perícias (teal)
9. Fotos e Evidências (rosa)
10. Outros (cinza)

##### **Tag**
- `nome`: Nome da tag (ex: Urgente, Importante)
- `cor`: Cor em hexadecimal
- `escritorio`: FK para multi-tenant

**Tags Padrão Criadas:**
- Urgente, Importante, Revisão, Aprovado, Assinado, Original, Cópia, Rascunho, Arquivado, Em Análise

##### **Documento**
- `arquivo`: FileField - arquivo físico
- `titulo`: Título do documento
- `descricao`: Descrição opcional
- `categoria`: FK para Categoria
- `tags`: M2M para Tag
- `cliente`: FK para Cliente
- `escritorio`: FK para Escritorio
- `hash_md5`: Hash para detecção de duplicatas
- `tamanho`: Tamanho em bytes
- `tipo_arquivo`: Extensão (pdf, docx, jpg, etc)
- `nome_original`: Nome original do arquivo
- `data_upload`: Data/hora do upload
- `data_documento`: Data do documento (opcional)
- `confidencial`: Boolean
- `versao`: Número da versão
- `documento_pai`: Self FK para versionamento
- `visualizacoes`: Contador
- `downloads`: Contador
- `usuario_upload`: FK para User
- `texto_extraido`: TextField (preparado para OCR futuro)
- `ativo`: Flag para soft delete

**Métodos:**
- `get_tamanho_formatado()`: Retorna tamanho legível (KB, MB, GB)
- `incrementar_visualizacoes()`: Incrementa contador
- `incrementar_downloads()`: Incrementa contador

#### 2. **Serializers** (`documentos/serializers.py`)

- `CategoriaSerializer`: Para categorias (inclui total_documentos)
- `TagSerializer`: Para tags (inclui total_documentos)
- `DocumentoListSerializer`: Lista simplificada
- `DocumentoDetailSerializer`: Detalhes completos + versões
- `DocumentoCreateSerializer`: Para upload
- `DocumentoUpdateSerializer`: Para atualização de metadados

#### 3. **Views** (`documentos/views.py`)

##### **CategoriaViewSet**
- CRUD completo
- Search: nome
- Ordering: nome, ordem

##### **TagViewSet**
- CRUD completo
- Search: nome
- Ordering: nome

##### **DocumentoViewSet**
- CRUD completo
- **Filtros:**
  - `cliente`: ID do cliente
  - `categoria`: ID da categoria
  - `confidencial`: Boolean
  - `tipo_arquivo`: Extensão
  - `data_inicio` / `data_fim`: Range de datas
  - `tags`: Lista de IDs (separados por vírgula)
- **Search:** titulo, descricao, nome_original, texto_extraido
- **Ordering:** data_upload, titulo, tamanho

**Actions Customizadas:**
- `download(id)`: Download do arquivo (incrementa contador)
- `incrementar_visualizacao(id)`: POST para incrementar contador
- `estatisticas()`: GET para estatísticas agregadas
  - Total de documentos
  - Tamanho total
  - Por categoria
  - Por tipo de arquivo
  - Total de visualizações
  - Total de downloads

**Soft Delete:** `perform_destroy()` marca `ativo=False`

#### 4. **Admin** (`documentos/admin.py`)

Interface administrativa completa com:
- Fieldsets organizados
- Filtros laterais
- Busca
- Campos readonly para auditoria

#### 5. **URLs** (`documentos/urls.py`)

```
/api/documentos/categorias/
/api/documentos/tags/
/api/documentos/
/api/documentos/{id}/
/api/documentos/{id}/download/
/api/documentos/{id}/incrementar-visualizacao/
/api/documentos/estatisticas/
```

#### 6. **Comandos de Gestão**

```bash
python manage.py criar_categorias_padrao
python manage.py criar_tags_padrao
```

---

### 🎨 **Frontend (React + Material-UI)**

#### 1. **Serviço** (`utils/documentService.js`)

**Funções de Categorias:**
- `listCategorias()`: Lista todas
- `createCategoria(data)`: Cria nova
- `updateCategoria(id, data)`: Atualiza
- `deleteCategoria(id)`: Remove

**Funções de Tags:**
- `listTags()`: Lista todas
- `createTag(data)`: Cria nova

**Funções de Documentos:**
- `listDocumentos(params)`: Lista com filtros
- `getDocumento(id)`: Detalhes
- `uploadDocumento(formData, onUploadProgress)`: Upload com progresso
- `updateDocumento(id, data)`: Atualiza metadados
- `deleteDocumento(id)`: Remove (soft delete)
- `downloadDocumento(id, nomeOriginal)`: Download
- `incrementarVisualizacao(id)`: Incrementa contador
- `getEstatisticas(params)`: Estatísticas

**Helpers:**
- `formatFileSize(bytes)`: Formata tamanho
- `getFileIcon(tipo)`: Retorna nome do ícone
- `getFileColor(tipo)`: Retorna cor
- `validateFileType(file)`: Valida tipo
- `validateFileSize(file, maxMB)`: Valida tamanho (padrão 10MB)

#### 2. **Página Principal** (`pages/DocumentosPage.js`)

**Features:**
- Grid de cards com documentos
- Busca por texto
- Filtros avançados:
  - Categoria
  - Tags (múltiplas)
  - Apenas confidenciais
- Dialog de upload com:
  - Seleção de arquivo
  - Título (auto-preenchido)
  - Descrição
  - Categoria
  - Tags (múltiplas)
  - Data do documento
  - Flag confidencial
  - Barra de progresso
- Dialog de edição
- Menu de ações (Download, Editar, Deletar)
- Contadores de visualizações e downloads
- Ícones por tipo de arquivo
- Chips para categorias e tags

#### 3. **Componente Cliente** (`components/ClientDocuments.js`)

**Features:**
- Tabela de documentos do cliente
- Upload vinculado automaticamente ao cliente
- Ações rápidas (Download, Editar, Deletar)
- Exibição de:
  - Tipo de arquivo (ícone)
  - Título
  - Categoria
  - Tamanho
  - Data de upload
  - Visualizações
  - Downloads
  - Flag confidencial

#### 4. **Integração** (`pages/ClientDetailPage.js`)

**Tabs Adicionadas:**
1. **Consultas** (existente)
2. **Documentos** (novo - usa ClientDocuments)

---

## Estrutura de Arquivos

### Backend
```
backend/
├── documentos/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py              # Categoria, Tag, Documento
│   ├── serializers.py         # 5 serializers
│   ├── views.py               # 3 ViewSets
│   ├── urls.py                # Router
│   ├── tests.py
│   ├── management/
│   │   ├── __init__.py
│   │   └── commands/
│   │       ├── __init__.py
│   │       ├── criar_categorias_padrao.py
│   │       └── criar_tags_padrao.py
│   └── migrations/
│       ├── __init__.py
│       └── 0001_initial.py
├── config/
│   ├── settings.py            # INSTALLED_APPS, MEDIA_ROOT
│   └── urls.py                # /api/documentos/
└── media/
    └── documentos/            # Arquivos organizados
        ├── escritorio_1/
        │   └── cliente_X/
        │       └── 2024/
        │           └── 12/
```

### Frontend
```
frontend/
├── src/
│   ├── utils/
│   │   └── documentService.js     # API + helpers
│   ├── pages/
│   │   ├── DocumentosPage.js      # Página principal
│   │   └── ClientDetailPage.js    # Com tabs
│   └── components/
│       └── ClientDocuments.js     # Componente para cliente
└── ...
```

---

## Armazenamento de Arquivos

**Padrão de Organização:**
```
media/documentos/{escritorio_id}/cliente_{cliente_id}/{YYYY}/{MM}/{filename}
```

**Exemplo:**
```
media/documentos/1/cliente_42/2024/12/contrato_prestacao_servicos.pdf
```

---

## Validações

### Tipos de Arquivo Permitidos
- Documentos: `pdf`, `doc`, `docx`, `txt`
- Planilhas: `xlsx`, `xls`
- Imagens: `jpg`, `jpeg`, `png`

### Tamanho Máximo
- **10 MB** por arquivo

---

## Segurança

### Multi-tenant
- Todos os modelos são isolados por `escritorio`
- Filtros automáticos aplicados nos ViewSets
- `usuario_upload` registrado automaticamente

### Soft Delete
- Documentos não são excluídos fisicamente
- Campo `ativo=False` marca exclusão
- Permite auditoria e recuperação

### Hash MD5
- Gerado automaticamente no upload
- Permite detecção de duplicatas
- Útil para integridade de dados

---

## Auditoria

**Campos de Auditoria:**
- `data_upload`: Timestamp do upload
- `usuario_upload`: Usuário que fez upload
- `visualizacoes`: Contador de visualizações
- `downloads`: Contador de downloads
- `versao`: Número da versão
- `documento_pai`: Referência para versões anteriores

---

## API Endpoints

### Categorias
```
GET    /api/documentos/categorias/          # Lista
POST   /api/documentos/categorias/          # Cria
GET    /api/documentos/categorias/{id}/     # Detalhes
PATCH  /api/documentos/categorias/{id}/     # Atualiza
DELETE /api/documentos/categorias/{id}/     # Remove
```

### Tags
```
GET    /api/documentos/tags/                # Lista
POST   /api/documentos/tags/                # Cria
GET    /api/documentos/tags/{id}/           # Detalhes
PATCH  /api/documentos/tags/{id}/           # Atualiza
DELETE /api/documentos/tags/{id}/           # Remove
```

### Documentos
```
GET    /api/documentos/                     # Lista (com filtros)
POST   /api/documentos/                     # Upload
GET    /api/documentos/{id}/                # Detalhes
PATCH  /api/documentos/{id}/                # Atualiza metadados
DELETE /api/documentos/{id}/                # Remove (soft)
GET    /api/documentos/{id}/download/       # Download
POST   /api/documentos/{id}/incrementar-visualizacao/
GET    /api/documentos/estatisticas/        # Stats
```

### Exemplos de Filtros

**Listar documentos de um cliente:**
```
GET /api/documentos/?cliente=42
```

**Filtrar por categoria e tags:**
```
GET /api/documentos/?categoria=1&tags=5,7,9
```

**Buscar por texto:**
```
GET /api/documentos/?search=contrato
```

**Range de datas:**
```
GET /api/documentos/?data_inicio=2024-01-01&data_fim=2024-12-31
```

**Apenas confidenciais:**
```
GET /api/documentos/?confidencial=true
```

---

## Fluxo de Uso

### Upload de Documento

1. Usuário acessa página do cliente
2. Clica em "Documentos" (tab)
3. Clica em "Novo Documento"
4. Seleciona arquivo (validação automática)
5. Preenche metadados:
   - Título (auto-preenchido com nome do arquivo)
   - Descrição (opcional)
   - Categoria
   - Tags
   - Data do documento
   - Confidencial (checkbox)
6. Clica em "Enviar"
7. Barra de progresso exibida
8. Documento aparece na lista

### Download de Documento

1. Usuário visualiza lista de documentos
2. Clica no ícone de download
3. Arquivo é baixado
4. Contador de downloads incrementado

### Edição de Metadados

1. Usuário clica em "Editar"
2. Dialog abre com dados atuais
3. Usuário modifica campos
4. Clica em "Salvar"
5. Lista é atualizada

### Exclusão

1. Usuário clica em "Deletar"
2. Confirmação é solicitada
3. Documento é marcado como `ativo=False`
4. Não aparece mais nas listagens

---

## Estatísticas

A ação `estatisticas` retorna:
```json
{
  "total_documentos": 150,
  "tamanho_total": "2.5 GB",
  "por_categoria": [
    {"categoria": "Contratos", "total": 45},
    {"categoria": "Petições", "total": 30},
    ...
  ],
  "por_tipo": [
    {"tipo": "pdf", "total": 100},
    {"tipo": "docx", "total": 30},
    ...
  ],
  "total_visualizacoes": 450,
  "total_downloads": 230
}
```

---

## Próximas Fases (Não Implementadas)

### **Fase 3: Visualização Inline**
- Viewer de PDF no navegador
- Preview de imagens
- Conversão de DOCX para HTML

### **Fase 4: OCR e Busca Avançada**
- Extração de texto de imagens (Tesseract)
- Extração de texto de PDFs (PyPDF2)
- Busca full-text no conteúdo
- Índices de busca (ElasticSearch ou PostgreSQL full-text)

### **Fase 5: Assinatura Digital**
- Integração com certificado digital
- Validação de assinaturas
- Controle de autenticidade

---

## Comandos Úteis

### Criar categorias e tags padrão
```bash
cd backend
python manage.py criar_categorias_padrao
python manage.py criar_tags_padrao
```

### Migrar banco de dados
```bash
python manage.py makemigrations documentos
python manage.py migrate documentos
```

### Acessar shell Django
```bash
python manage.py shell
```

### Exemplos no shell
```python
from documentos.models import Categoria, Tag, Documento
from clientes.models import Cliente

# Listar categorias
Categoria.objects.filter(escritorio_id=1)

# Listar documentos de um cliente
Documento.objects.filter(cliente_id=42, ativo=True)

# Calcular espaço usado
from django.db.models import Sum
total = Documento.objects.aggregate(Sum('tamanho'))
```

---

## Permissões

O sistema herda as permissões do Django:
- `add_documento`
- `change_documento`
- `delete_documento`
- `view_documento`

Similarmente para Categoria e Tag.

**Nota:** É recomendado integrar com o sistema de permissões existente do escritório.

---

## Logs e Auditoria

Todos os uploads são registrados com:
- Usuário que fez upload
- Data/hora
- IP (se disponível via middleware)
- Escritório

**Integração futura:** Vincular com o sistema de Audit Logs existente.

---

## Troubleshooting

### Erro ao fazer upload
1. Verificar permissões do diretório `media/`
2. Verificar tamanho do arquivo (máx 10MB)
3. Verificar tipo de arquivo permitido
4. Verificar logs do Django

### Arquivo não aparece na lista
1. Verificar se `ativo=True`
2. Verificar filtros de escritório
3. Verificar filtros aplicados

### Download não funciona
1. Verificar se arquivo existe fisicamente
2. Verificar permissões de leitura
3. Verificar configuração de `MEDIA_URL` e `MEDIA_ROOT`

---

## Considerações Finais

O sistema está **completo** para as Fases 1 e 2:
- ✅ Upload de documentos
- ✅ Download de documentos
- ✅ Organização por categorias
- ✅ Tags personalizadas
- ✅ Filtros avançados
- ✅ Busca por texto
- ✅ Multi-tenant
- ✅ Auditoria básica
- ✅ Soft delete
- ✅ Vinculação com clientes

O sistema está pronto para uso em produção e pode ser expandido com as fases futuras conforme necessidade.

---

**Desenvolvido em:** Dezembro 2024  
**Versão Backend:** Django 5.2.6  
**Versão Frontend:** React 18.x  
**UI Framework:** Material-UI 5.x
