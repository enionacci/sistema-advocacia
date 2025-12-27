# 📋 Estrutura de Armazenamento da Anonimização

## 🎯 Visão Geral

O sistema de anonimização armazena **TODAS as informações necessárias** para reversão completa do documento, mantendo o texto original intacto.

---

## 🗄️ Estrutura de Banco de Dados

### 1. **Tabela: `DocumentoAnonimizacao`**
**Armazena o registro principal da anonimização**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | Integer | ID único da anonimização |
| `escritorio` | ForeignKey | Escritório responsável |
| `documento` | ForeignKey | **Referência ao documento original** |
| `usuario` | ForeignKey | Usuário que solicitou a anonimização |
| `status` | CharField | Status: pendente, processando, concluido, erro, revertido |
| `texto_original` | TextField | **📄 BACKUP DO TEXTO ORIGINAL COMPLETO** |
| `texto_anonimizado` | TextField | **🔒 TEXTO COM DADOS ANONIMIZADOS** |
| `anonimizar_nomes` | Boolean | Configuração: anonimizar nomes |
| `anonimizar_cpf` | Boolean | Configuração: anonimizar CPF |
| `anonimizar_rg` | Boolean | Configuração: anonimizar RG |
| `anonimizar_enderecos` | Boolean | Configuração: anonimizar endereços |
| `anonimizar_telefones` | Boolean | Configuração: anonimizar telefones |
| `anonimizar_emails` | Boolean | Configuração: anonimizar e-mails |
| `data_solicitacao` | DateTime | Quando foi solicitada |
| `data_conclusao` | DateTime | Quando foi concluída |
| `data_reversao` | DateTime | Quando foi revertida (se aplicável) |
| `mensagem_erro` | TextField | Mensagem de erro (se houver) |

**Localização no código:**
- Model: `backend/documentos/models.py` (linha ~445)
- Criação: `backend/documentos/anonymization_views.py` (função `anonymize_document`)

---

### 2. **Tabela: `AnonimizacaoItem`**
**Armazena CADA substituição individual (mapeamento reversível)**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | Integer | ID único do item |
| `anonimizacao` | ForeignKey | **Referência à anonimização pai** |
| `tipo_dado` | CharField | Tipo: nome, cpf, rg, endereco, telefone, email, outro |
| `valor_original` | TextField | **🔓 VALOR REAL (ex: "João Silva")** |
| `valor_anonimizado` | CharField | **🔒 PLACEHOLDER (ex: "NOME1")** |
| `posicao_inicio` | Integer | Posição inicial no texto original (opcional) |
| `posicao_fim` | Integer | Posição final no texto original (opcional) |
| `contexto` | CharField | Trecho ao redor para contexto (até 200 chars) |
| `data_criacao` | DateTime | Quando foi criado |

**Localização no código:**
- Model: `backend/documentos/models.py` (linha ~555)
- Criação: `backend/documentos/anonymization_service.py` (linha ~385)

**Relação:** Cada `AnonimizacaoItem` pertence a uma `DocumentoAnonimizacao` (relacionamento 1:N)

---

## 📊 Exemplo Prático de Armazenamento

### Cenário: Anonimização de uma petição

**Documento Original:**
```
O Sr. João da Silva, CPF 123.456.789-00, residente à Rua das Flores, 123, 
São Paulo/SP, solicita...
```

### Dados Gravados:

#### **1. DocumentoAnonimizacao (Tabela Principal)**
```sql
id: 42
escritorio_id: 5
documento_id: 103
usuario_id: 7
status: 'concluido'
texto_original: 'O Sr. João da Silva, CPF 123.456.789-00, residente à...'
texto_anonimizado: 'O Sr. NOME1, CPF1, residente à ENDERECO1...'
anonimizar_nomes: true
anonimizar_cpf: true
anonimizar_enderecos: true
data_solicitacao: 2025-10-07 14:30:00
data_conclusao: 2025-10-07 14:30:15
```

#### **2. AnonimizacaoItem (Itens de Substituição)**

**Item 1:**
```sql
id: 201
anonimizacao_id: 42
tipo_dado: 'nome'
valor_original: 'João da Silva'
valor_anonimizado: 'NOME1'
posicao_inicio: 7
posicao_fim: 21
contexto: 'O Sr. João da Silva, CPF 123'
```

**Item 2:**
```sql
id: 202
anonimizacao_id: 42
tipo_dado: 'cpf'
valor_original: '123.456.789-00'
valor_anonimizado: 'CPF1'
posicao_inicio: 27
posicao_fim: 41
contexto: 'Silva, CPF 123.456.789-00, residente'
```

**Item 3:**
```sql
id: 203
anonimizacao_id: 42
tipo_dado: 'endereco'
valor_original: 'Rua das Flores, 123, São Paulo/SP'
valor_anonimizado: 'ENDERECO1'
posicao_inicio: 56
posicao_fim: 89
contexto: 'residente à Rua das Flores, 123, São Paulo/SP, solicita'
```

---

## 🔄 Como Funciona a Reversão

### Processo de Reversão:
1. **Busca** o registro `DocumentoAnonimizacao` pelo ID
2. **Recupera** o `texto_original` gravado
3. **Restaura** no documento (se necessário)
4. **Mantém** todos os `AnonimizacaoItem` para auditoria

### Código de Reversão:
```python
# backend/documentos/anonymization_service.py
def reverse_anonymization(self, anonimizacao: DocumentoAnonimizacao) -> bool:
    # Restaura texto original
    documento = anonimizacao.documento
    documento.texto_extraido = anonimizacao.texto_original
    documento.save()
    
    # Marca como revertido
    anonimizacao.status = 'revertido'
    anonimizacao.data_reversao = timezone.now()
    anonimizacao.save()
```

---

## 🛡️ Segurança e Proteção de Dados

### ✅ Garantias do Sistema:

1. **Texto Original Preservado**: 
   - Gravado em `DocumentoAnonimizacao.texto_original`
   - **NUNCA é sobrescrito no documento original**

2. **Mapeamento Completo**:
   - Cada substituição é registrada em `AnonimizacaoItem`
   - Permite auditoria e reversão precisa

3. **Isolamento por Escritório**:
   - Todos os registros são filtrados por `escritorio_id`
   - Um escritório não acessa dados de outro

4. **Auditoria Completa**:
   - Quem solicitou (`usuario`)
   - Quando foi feito (`data_solicitacao`, `data_conclusao`)
   - Configurações usadas (`anonimizar_*`)

5. **Soft Delete**:
   - Registros podem ser deletados via endpoint DELETE
   - Items relacionados são deletados em CASCADE

---

## 📍 Localização dos Dados

### **No Documento (`Documento.texto_extraido`)**
- ✅ **Mantém o texto ORIGINAL intacto**
- ❌ **NÃO é mais sobrescrito** (correção aplicada)

### **Na Anonimização (`DocumentoAnonimizacao`)**
- `texto_original`: Backup do texto original
- `texto_anonimizado`: Texto com placeholders (NOME1, CPF1, etc.)

### **Nos Itens (`AnonimizacaoItem`)**
- Cada item mapeia: `NOME1` → `"João da Silva"`
- Permite reconstrução precisa

---

## 🔍 Consultas SQL Úteis

### Ver todas anonimizações de um documento:
```sql
SELECT * FROM documentos_documentoanonimizacao 
WHERE documento_id = 103
ORDER BY data_solicitacao DESC;
```

### Ver todas as substituições de uma anonimização:
```sql
SELECT tipo_dado, valor_original, valor_anonimizado, contexto
FROM documentos_anonimizacaoitem
WHERE anonimizacao_id = 42
ORDER BY posicao_inicio;
```

### Contar substituições por tipo:
```sql
SELECT tipo_dado, COUNT(*) as total
FROM documentos_anonimizacaoitem
WHERE anonimizacao_id = 42
GROUP BY tipo_dado;
```

---

## 🚀 Acesso via API

### Listar anonimizações:
```
GET /api/documentos/anonymizations/
```

### Detalhes de uma anonimização:
```
GET /api/documentos/anonymizations/{id}/
```

### Deletar uma anonimização:
```
DELETE /api/documentos/anonymizations/{id}/delete/
```

### Restaurar documento:
```
POST /api/documentos/{documento_id}/restore/
```

---

## ✅ Resumo da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        DOCUMENTO                             │
│  (texto_extraido = TEXTO ORIGINAL - NUNCA ALTERADO)         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ FK: documento_id
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  DOCUMENTOANONIMIZACAO                       │
│  - texto_original: BACKUP DO ORIGINAL                       │
│  - texto_anonimizado: TEXTO COM PLACEHOLDERS                │
│  - status, datas, configurações                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ FK: anonimizacao_id (CASCADE)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   ANONIMIZACAOITEM                           │
│  Item 1: NOME1 → "João da Silva"                            │
│  Item 2: CPF1 → "123.456.789-00"                            │
│  Item 3: ENDERECO1 → "Rua das Flores, 123..."              │
│  ... (N itens)                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Notas Importantes

1. **Texto Original SEMPRE Preservado**: O documento mantém seu `texto_extraido` original
2. **Anonimização é Camada Separada**: Gravada em tabelas específicas
3. **Reversão Simples**: Basta copiar `texto_original` de volta
4. **Múltiplas Anonimizações**: Um documento pode ter múltiplos registros de anonimização
5. **Auditoria Completa**: Todas as ações são rastreadas com timestamps e usuários
6. **Compliance LGPD**: Estrutura permite controle total sobre dados pessoais

---

**Última atualização**: 07/10/2025  
**Versão do documento**: 1.0
