# 🔒 Fluxo Completo: Anonimização → ChatGPT → Desanonimização

## 📋 Visão Geral

Este documento descreve o **fluxo completo de proteção de dados** ao usar IA externa (ChatGPT) para análise de documentos jurídicos, garantindo conformidade com a **LGPD** e proteção de dados sensíveis.

---

## 🎯 Problema que Resolve

Quando você precisa usar o ChatGPT para:
- 🔍 Analisar uma petição inicial
- 📝 Gerar uma contestação
- 💼 Revisar documentos jurídicos

**RISCO**: O ChatGPT não garante privacidade total. Pode haver vazamento de:
- 👤 Nomes de clientes
- 📄 CPF/RG
- 📍 Endereços
- 📞 Telefones
- 📧 E-mails

---

## ✅ Solução: Fluxo em 3 Etapas

```
┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 1: ANONIMIZAÇÃO                                          │
│  Petição Original → Sistema → Texto Anonimizado + Dicionário  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 2: PROCESSAMENTO EXTERNO                                 │
│  Texto Anonimizado → ChatGPT → Contestação Anonimizada         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 3: DESANONIMIZAÇÃO                                       │
│  Contestação Anonimizada + Dicionário → Contestação Real       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Exemplo Prático Completo

### 1️⃣ ETAPA 1: Anonimizar a Petição Inicial

**Documento Original (Petição Inicial):**
```
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL

João da Silva, brasileiro, solteiro, advogado, inscrito na OAB/SP sob o nº 
123.456, portador do CPF nº 987.654.321-00 e RG nº 12.345.678-X, residente 
e domiciliado na Rua das Flores, 123, Bairro Jardim, São Paulo/SP, CEP 
01234-567, telefone (11) 98765-4321, e-mail joao.silva@exemplo.com.br, 
vem, respeitosamente, à presença de Vossa Excelência, por intermédio de 
seu advogado que esta subscreve, propor a presente

AÇÃO DE COBRANÇA

em face de Maria Santos, brasileira, casada, empresária, inscrita no CPF 
nº 111.222.333-44, RG nº 98.765.432-Y, residente e domiciliada na Avenida 
Paulista, 1000, Bela Vista, São Paulo/SP, CEP 98765-432, telefone 
(11) 91234-5678, e-mail maria.santos@exemplo.com.br, pelos fatos e 
fundamentos jurídicos a seguir expostos:
```

**➡️ No Sistema:**
1. Acesse **Anonimização de Documentos**
2. Selecione o documento da petição
3. Configure quais dados anonimizar:
   - ✅ Nomes
   - ✅ CPF/RG
   - ✅ Endereços
   - ✅ Telefones
   - ✅ E-mails
4. Clique em **"Anonimizar com IA"**

**Texto Anonimizado (Gerado pelo Sistema):**
```
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL

NOME1, brasileiro, solteiro, advogado, inscrito na OAB/SP sob o nº 
123.456, portador do CPF nº CPF1 e RG nº RG1, residente 
e domiciliado na ENDERECO1, CEP 01234-567, telefone TELEFONE1, 
e-mail EMAIL1, vem, respeitosamente, à presença de Vossa Excelência, 
por intermédio de seu advogado que esta subscreve, propor a presente

AÇÃO DE COBRANÇA

em face de NOME2, brasileira, casada, empresária, inscrita no CPF 
nº CPF2, RG nº RG2, residente e domiciliada na ENDERECO2, 
CEP 98765-432, telefone TELEFONE2, e-mail EMAIL2, pelos fatos e 
fundamentos jurídicos a seguir expostos:
```

**📊 Dicionário Salvo (Automaticamente):**
```
NOME1      → João da Silva
CPF1       → 987.654.321-00
RG1        → 12.345.678-X
ENDERECO1  → Rua das Flores, 123, Bairro Jardim, São Paulo/SP
TELEFONE1  → (11) 98765-4321
EMAIL1     → joao.silva@exemplo.com.br
NOME2      → Maria Santos
CPF2       → 111.222.333-44
RG2        → 98.765.432-Y
ENDERECO2  → Avenida Paulista, 1000, Bela Vista, São Paulo/SP
TELEFONE2  → (11) 91234-5678
EMAIL2     → maria.santos@exemplo.com.br
```

---

### 2️⃣ ETAPA 2: Enviar para ChatGPT

**Ação:** Copie o **Texto Anonimizado** e envie para o ChatGPT

**Prompt para o ChatGPT:**
```
Com base na petição inicial abaixo, elabore uma contestação jurídica 
fundamentada, mantendo os mesmos identificadores (NOME1, CPF1, etc):

[Cole aqui o TEXTO ANONIMIZADO completo]
```

**Resposta do ChatGPT (Contestação Anonimizada):**
```
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL

NOME2, qualificada nos autos, por meio de seu advogado que esta subscreve, 
vem, respeitosamente, à presença de Vossa Excelência, apresentar

CONTESTAÇÃO

aos termos da Ação de Cobrança proposta por NOME1, CPF1, residente em 
ENDERECO1, pelas razões de fato e de direito a seguir expostas:

I - DOS FATOS

A parte autora, NOME1, alega ser credor de valores não comprovados 
documentalmente. A ré, NOME2, inscrita no CPF2, residente em ENDERECO2, 
nega categoricamente a existência do débito alegado.

O autor não apresentou comprovantes de entrega de mercadorias ou prestação 
de serviços que justifiquem a cobrança. Ademais, os contatos realizados 
nos telefones TELEFONE1 e e-mail EMAIL1 nunca foram respondidos pela ré.

II - DO DIREITO

A contestante, NOME2, com endereço em ENDERECO2, telefone TELEFONE2 e 
e-mail EMAIL2, jamais celebrou qualquer contrato com NOME1, CPF1. 
A cobrança é indevida e carece de fundamentação legal.

Pelo exposto, requer-se a TOTAL IMPROCEDÊNCIA da ação, condenando o autor 
ao pagamento das custas processuais e honorários advocatícios.

Termos em que,
Pede deferimento.

Local e Data
Advogado OAB/XX
```

---

### 3️⃣ ETAPA 3: Desanonimizar a Contestação

**➡️ No Sistema:**
1. Vá para **Anonimização de Documentos**
2. No **Histórico de Anonimizações**, localize a petição original
3. Clique no botão **"Desanonimizar"**
4. Cole toda a **Contestação do ChatGPT** (com NOME1, CPF1, etc)
5. Clique em **"Desanonimizar"**

**Contestação Desanonimizada (Resultado Final):**
```
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL

Maria Santos, qualificada nos autos, por meio de seu advogado que esta 
subscreve, vem, respeitosamente, à presença de Vossa Excelência, apresentar

CONTESTAÇÃO

aos termos da Ação de Cobrança proposta por João da Silva, 987.654.321-00, 
residente em Rua das Flores, 123, Bairro Jardim, São Paulo/SP, pelas razões 
de fato e de direito a seguir expostas:

I - DOS FATOS

A parte autora, João da Silva, alega ser credor de valores não comprovados 
documentalmente. A ré, Maria Santos, inscrita no CPF 111.222.333-44, 
residente em Avenida Paulista, 1000, Bela Vista, São Paulo/SP, nega 
categoricamente a existência do débito alegado.

O autor não apresentou comprovantes de entrega de mercadorias ou prestação 
de serviços que justifiquem a cobrança. Ademais, os contatos realizados 
nos telefones (11) 98765-4321 e e-mail joao.silva@exemplo.com.br nunca 
foram respondidos pela ré.

II - DO DIREITO

A contestante, Maria Santos, com endereço em Avenida Paulista, 1000, 
Bela Vista, São Paulo/SP, telefone (11) 91234-5678 e e-mail 
maria.santos@exemplo.com.br, jamais celebrou qualquer contrato com 
João da Silva, 987.654.321-00. A cobrança é indevida e carece de 
fundamentação legal.

Pelo exposto, requer-se a TOTAL IMPROCEDÊNCIA da ação, condenando o autor 
ao pagamento das custas processuais e honorários advocatícios.

Termos em que,
Pede deferimento.

Local e Data
Advogado OAB/XX
```

**✅ PRONTO!** Agora você tem uma contestação jurídica completa, revisada por IA, com todos os dados reais do seu cliente, **SEM TER EXPOSTO DADOS SENSÍVEIS AO CHATGPT**.

---

## 🔧 Como Funciona Tecnicamente

### Backend (Django)

**1. Serviço de Anonimização (`anonymization_service.py`):**
```python
# Método de Anonimização
def detect_and_anonymize_ai(texto, config):
    # Envia para Hugging Face AI (GPT-OSS 120B)
    # Detecta: Nomes, CPF, RG, Endereços, Telefones, E-mails
    # Retorna: texto_anonimizado + lista de substituições
    return texto_anonimizado, substituicoes

# Método de Desanonimização (NOVO!)
def deanonymize_text(texto_anonimizado, anonimizacao_id):
    # Busca o dicionário da anonimização original
    # Substitui todos os placeholders pelos valores reais
    # NOME1 → João da Silva
    # CPF1 → 987.654.321-00
    return texto_desanonimizado, total_substituicoes
```

**2. API Endpoint (`anonymization_views.py`):**
```python
@api_view(['POST'])
def deanonymize_text(request, anonimizacao_id):
    # POST /api/documentos/anonymizations/<id>/deanonymize/
    # Body: { "texto_anonimizado": "..." }
    # Response: { 
    #   "texto_desanonimizado": "...",
    #   "total_substituicoes": 12
    # }
```

### Frontend (React)

**1. Dialog de Desanonimização (`AnonymizePage.js`):**
```javascript
const handleDeanonymizeText = async () => {
  const response = await axios.post(
    `/api/documentos/anonymizations/${anonimizacao.id}/deanonymize/`,
    { texto_anonimizado: textoParaDesanonimizar }
  );
  
  setTextoDesanonimizado(response.data.texto_desanonimizado);
  // Mostra: X substituições realizadas
};
```

---

## 🗄️ Estrutura de Dados

### Modelo `DocumentoAnonimizacao`
```python
- id: int
- documento: ForeignKey(Documento)
- texto_original: TextField          # Backup do original
- texto_anonimizado: TextField       # Texto com placeholders
- status: CharField                  # 'pendente', 'concluido', 'erro'
- data_solicitacao: DateTimeField
- data_conclusao: DateTimeField
```

### Modelo `AnonimizacaoItem` (Dicionário)
```python
- id: int
- anonimizacao: ForeignKey(DocumentoAnonimizacao)
- tipo_dado: CharField               # 'nome', 'cpf', 'endereco', etc
- valor_original: TextField          # "João da Silva"
- valor_anonimizado: CharField       # "NOME1"
- posicao_inicio: int
- posicao_fim: int
```

**Exemplo de registros no banco:**

| id | tipo_dado | valor_original      | valor_anonimizado |
|----|-----------|---------------------|-------------------|
| 1  | nome      | João da Silva       | NOME1             |
| 2  | cpf       | 987.654.321-00      | CPF1              |
| 3  | rg        | 12.345.678-X        | RG1               |
| 4  | endereco  | Rua das Flores, 123 | ENDERECO1         |
| 5  | telefone  | (11) 98765-4321     | TELEFONE1         |
| 6  | email     | joao@exemplo.com.br | EMAIL1            |

---

## 📊 Fluxo de Dados Completo

```
┌──────────────────────┐
│  DOCUMENTO ORIGINAL  │ ← Usuário faz upload de petição.pdf
│  (texto_extraido)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  ANONIMIZAÇÃO (Botão "Anonimizar com IA")                │
│  ↓ AnonymizationService.detect_and_anonymize_ai()        │
│  ↓ Hugging Face API (GPT-OSS 120B)                       │
│  ↓ Detecta: Nomes, CPF, RG, Endereços, Telefones, Emails│
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  BANCO DE DADOS                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ DocumentoAnonimizacao                            │    │
│  │  - texto_original: "João da Silva..."           │    │
│  │  - texto_anonimizado: "NOME1..."                │    │
│  │  - status: 'concluido'                          │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ AnonimizacaoItem (Dicionário)                   │    │
│  │  - NOME1 → João da Silva                        │    │
│  │  - CPF1 → 987.654.321-00                        │    │
│  │  - RG1 → 12.345.678-X                           │    │
│  │  - ENDERECO1 → Rua das Flores, 123              │    │
│  │  ... (todos os itens)                           │    │
│  └─────────────────────────────────────────────────┘    │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  USUÁRIO COPIA TEXTO ANONIMIZADO                         │
│  "NOME1, CPF1, residente em ENDERECO1..."               │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  CHATGPT (Externo)                                       │
│  Prompt: "Elabore contestação com base em..."           │
│  Resposta: "NOME2 contesta NOME1, CPF1, ENDERECO1..."   │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  USUÁRIO COLA RESPOSTA DO CHATGPT NO SISTEMA            │
│  (Dialog "Desanonimizar")                                │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  DESANONIMIZAÇÃO (Botão "Desanonimizar")                │
│  ↓ POST /api/anonymizations/<id>/deanonymize/           │
│  ↓ AnonymizationService.deanonymize_text()              │
│  ↓ Busca dicionário (AnonimizacaoItem)                  │
│  ↓ Substitui: NOME1 → João da Silva                     │
│  ↓            CPF1 → 987.654.321-00                      │
│  ↓            ENDERECO1 → Rua das Flores, 123           │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  CONTESTAÇÃO FINAL COM DADOS REAIS                       │
│  "Maria Santos contesta João da Silva, 987.654.321-00..." │
│  ✅ PRONTO PARA PROTOCOLAR!                              │
└──────────────────────────────────────────────────────────┘
```

---

## 🔐 Segurança e Conformidade LGPD

### ✅ Conformidade Garantida

1. **Minimização de Dados**: Apenas dados necessários são processados
2. **Pseudonimização**: Dados sensíveis são substituídos por placeholders
3. **Controle de Acesso**: Apenas escritório do documento pode acessar anonimizações
4. **Auditoria Completa**: Todas as operações são registradas em logs
5. **Reversibilidade**: Dicionário seguro permite recuperação controlada

### 🛡️ Proteção de Dados Implementada

```python
# Verificação de Escritório
if anonimizacao.escritorio != request.user.perfil.escritorio:
    return Response({'error': 'Acesso negado'}, 403)

# Auditoria Automática (middleware)
AuditLog.objects.create(
    usuario=request.user,
    acao='DEANONYMIZE_TEXT',
    objeto_tipo=ContentType.get_for_model(DocumentoAnonimizacao),
    objeto_id=anonimizacao_id,
    descricao=f"Desanonimizou texto usando anonimização #{anonimizacao_id}"
)
```

---

## 📝 Casos de Uso Adicionais

### 1. Análise de Contratos
```
Contrato Original → Anonimizar
  → ChatGPT: "Analise cláusulas abusivas"
    → Recebe análise com NOME1, ENDERECO1
      → Desanonimizar
        → Relatório final com dados reais
```

### 2. Revisão de Documentos
```
Documento → Anonimizar
  → ChatGPT: "Revise ortografia e formatação"
    → Recebe documento corrigido
      → Desanonimizar
        → Documento final revisado
```

### 3. Geração de Peças Jurídicas
```
Resumo do Caso → Anonimizar
  → ChatGPT: "Gere petição inicial baseada em..."
    → Recebe petição com placeholders
      → Desanonimizar
        → Petição final com dados do cliente
```

---

## 🚀 Comandos da API

### 1. Anonimizar Documento
```bash
POST /api/documentos/<documento_id>/anonymize/
Content-Type: application/json

{
  "anonimizar_nomes": true,
  "anonimizar_cpf": true,
  "anonimizar_rg": true,
  "anonimizar_enderecos": true,
  "anonimizar_telefones": true,
  "anonimizar_emails": true,
  "use_ai": true
}

Response:
{
  "success": true,
  "anonimizacao_id": 123,
  "texto_anonimizado": "NOME1 com CPF CPF1...",
  "total_substituicoes": 12
}
```

### 2. Listar Anonimizações
```bash
GET /api/documentos/anonymizations/

Response:
{
  "results": [
    {
      "id": 123,
      "documento_id": 456,
      "documento_titulo": "Petição Inicial - Cliente X",
      "status": "concluido",
      "total_substituicoes": 12,
      "data_solicitacao": "2025-10-07T14:30:00Z",
      "tipo_anonimizacao": "ai"
    }
  ]
}
```

### 3. Desanonimizar Texto (NOVO!)
```bash
POST /api/documentos/anonymizations/<anonimizacao_id>/deanonymize/
Content-Type: application/json

{
  "texto_anonimizado": "NOME1 contesta NOME2, CPF CPF1, residente em ENDERECO1..."
}

Response:
{
  "success": true,
  "texto_desanonimizado": "João da Silva contesta Maria Santos, CPF 987.654.321-00, residente em Rua das Flores, 123...",
  "total_substituicoes": 8,
  "anonimizacao_id": 123,
  "documento": {
    "id": 456,
    "titulo": "Petição Inicial - Cliente X"
  }
}
```

### 4. Ver Detalhes da Anonimização
```bash
GET /api/documentos/anonymizations/<anonimizacao_id>/

Response:
{
  "id": 123,
  "documento": { "id": 456, "titulo": "Petição..." },
  "status": "concluido",
  "total_substituicoes": 12,
  "configuracao": {
    "anonimizar_nomes": true,
    "anonimizar_cpf": true,
    ...
  },
  "itens": [
    {
      "id": 1,
      "tipo_dado": "nome",
      "valor_original": "João da Silva",
      "valor_anonimizado": "NOME1"
    },
    ...
  ],
  "texto_preview": {
    "original": "João da Silva, CPF 987.654.321-00...",
    "anonimizado": "NOME1, CPF CPF1..."
  }
}
```

---

## 🎓 Perguntas Frequentes (FAQ)

### ❓ O ChatGPT vai ver os dados reais?
**Não!** Você envia apenas o texto anonimizado com placeholders (NOME1, CPF1, etc). O ChatGPT nunca vê os dados sensíveis.

### ❓ O dicionário fica salvo onde?
No banco de dados PostgreSQL do seu sistema, na tabela `AnonimizacaoItem`, protegida por autenticação e isolamento por escritório.

### ❓ Posso usar para múltiplos documentos?
Sim! Cada anonimização tem seu próprio dicionário independente. NOME1 do documento A é diferente de NOME1 do documento B.

### ❓ E se eu deletar a anonimização?
O dicionário também será deletado (CASCADE). O documento original não é afetado, apenas o registro de anonimização.

### ❓ Posso desanonimizar múltiplas vezes?
Sim! O dicionário permanece disponível. Você pode desanonimizar quantos textos quiser usando a mesma anonimização original.

### ❓ Funciona para outros idiomas?
Sim! A IA Hugging Face (GPT-OSS 120B) suporta múltiplos idiomas, incluindo português, inglês, espanhol, etc.

### ❓ E se o ChatGPT adicionar novos dados?
Apenas os placeholders presentes no dicionário serão desanonimizados. Textos novos criados pelo ChatGPT permanecerão como estão.

---

## ✅ Checklist de Uso

Antes de enviar ao ChatGPT:
- [ ] Documento foi anonimizado com sucesso
- [ ] Status da anonimização está como "Concluído"
- [ ] Verifiquei o texto anonimizado (não contém dados reais)
- [ ] Copiei o texto anonimizado completo

Ao usar o ChatGPT:
- [ ] Enviei apenas texto anonimizado
- [ ] Instrui o ChatGPT a manter os placeholders (NOME1, CPF1, etc)
- [ ] Recebi resposta do ChatGPT

Após receber resposta do ChatGPT:
- [ ] Copiei a resposta completa do ChatGPT
- [ ] Acessei o diálogo "Desanonimizar" no sistema
- [ ] Colei o texto do ChatGPT
- [ ] Cliquei em "Desanonimizar"
- [ ] Verifiquei que os dados foram restaurados corretamente
- [ ] Copiei o texto final desanonimizado

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte os logs do backend: `backend/documentos/anonymization_service.py`
2. Verifique o console do navegador (F12) para erros de frontend
3. Consulte a documentação de debug: `DEBUG_ANONIMIZACAO.md`

---

## 📚 Documentos Relacionados

- `ESTRUTURA_ANONIMIZACAO.md` - Estrutura do banco de dados
- `FLUXO_ANONIMIZACAO_VISUAL.md` - Diagramas visuais
- `GUIA_USO_ANONIMIZACAO.md` - Manual do usuário
- `DEBUG_ANONIMIZACAO.md` - Guia de troubleshooting

---

**Última Atualização:** 07/10/2025  
**Versão:** 2.0 - Com Desanonimização
