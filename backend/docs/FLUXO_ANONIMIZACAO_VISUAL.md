# 🔐 Fluxo de Anonimização - Diagrama Visual

## 📊 Fluxo Completo de Dados

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INÍCIO: DOCUMENTO ORIGINAL                       │
│                                                                           │
│  ID: 103                                                                  │
│  Título: "Petição Inicial - Cliente João Silva"                         │
│  texto_extraido: "O Sr. João da Silva, CPF 123.456.789-00..."          │
│  Status: ativo                                                           │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ USUÁRIO SOLICITA ANONIMIZAÇÃO
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PASSO 1: CRIAR REGISTRO DE ANONIMIZAÇÃO              │
│                                                                           │
│  DocumentoAnonimizacao.create():                                         │
│    - documento_id = 103                                                  │
│    - escritorio_id = 5                                                   │
│    - usuario_id = 7                                                      │
│    - texto_original = [CÓPIA DO TEXTO COMPLETO]  ← BACKUP!             │
│    - status = 'processando'                                              │
│    - data_solicitacao = NOW()                                            │
│    - anonimizar_nomes = true                                             │
│    - anonimizar_cpf = true                                               │
│    - anonimizar_enderecos = true                                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ PROCESSAR COM IA/REGEX
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PASSO 2: PROCESSAR TEXTO COM IA                       │
│                                                                           │
│  AnonymizationService.detect_and_anonymize_ai():                         │
│                                                                           │
│  ENTRADA:                                                                │
│  "O Sr. João da Silva, CPF 123.456.789-00, residente à                 │
│   Rua das Flores, 123, São Paulo/SP, telefone (11) 98765-4321..."      │
│                                                                           │
│  PROCESSAMENTO:                                                          │
│  ┌──────────────────────────────────────────────────┐                   │
│  │  Hugging Face API (GPT-OSS 120B)                │                   │
│  │  - Identifica: Nomes, CPFs, Endereços, etc.     │                   │
│  │  - Gera placeholders: NOME1, CPF1, ENDERECO1    │                   │
│  └──────────────────────────────────────────────────┘                   │
│                                                                           │
│  SAÍDA:                                                                  │
│  texto_anonimizado = "O Sr. NOME1, CPF1, residente à ENDERECO1,        │
│                       telefone TELEFONE1..."                             │
│                                                                           │
│  substituicoes = [                                                       │
│    {tipo: 'nome', original: 'João da Silva', anonimizado: 'NOME1'},    │
│    {tipo: 'cpf', original: '123.456.789-00', anonimizado: 'CPF1'},     │
│    {tipo: 'endereco', original: 'Rua das Flores, 123...', ...},        │
│    {tipo: 'telefone', original: '(11) 98765-4321', ...}                │
│  ]                                                                       │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ SALVAR RESULTADOS
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PASSO 3: SALVAR TEXTO ANONIMIZADO                     │
│                                                                           │
│  DocumentoAnonimizacao.update():                                         │
│    - texto_anonimizado = "O Sr. NOME1, CPF1, residente à ENDERECO1..." │
│    - status = 'concluido'                                                │
│    - data_conclusao = NOW()                                              │
│                                                                           │
│  ⚠️ IMPORTANTE: Documento.texto_extraido NÃO É ALTERADO!               │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ SALVAR CADA SUBSTITUIÇÃO
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PASSO 4: CRIAR ITENS DE SUBSTITUIÇÃO                 │
│                                                                           │
│  Para cada substituição encontrada:                                      │
│                                                                           │
│  AnonimizacaoItem.create() - Item 1:                                    │
│    ┌────────────────────────────────────────────────┐                   │
│    │ anonimizacao_id: 42                            │                   │
│    │ tipo_dado: 'nome'                              │                   │
│    │ valor_original: 'João da Silva'                │  ← DADO REAL     │
│    │ valor_anonimizado: 'NOME1'                     │  ← PLACEHOLDER   │
│    │ posicao_inicio: 7                              │                   │
│    │ posicao_fim: 21                                │                   │
│    │ contexto: 'O Sr. João da Silva, CPF 123'      │                   │
│    └────────────────────────────────────────────────┘                   │
│                                                                           │
│  AnonimizacaoItem.create() - Item 2:                                    │
│    ┌────────────────────────────────────────────────┐                   │
│    │ anonimizacao_id: 42                            │                   │
│    │ tipo_dado: 'cpf'                               │                   │
│    │ valor_original: '123.456.789-00'               │  ← DADO REAL     │
│    │ valor_anonimizado: 'CPF1'                      │  ← PLACEHOLDER   │
│    │ posicao_inicio: 27                             │                   │
│    │ posicao_fim: 41                                │                   │
│    └────────────────────────────────────────────────┘                   │
│                                                                           │
│  ... (continua para todos os itens encontrados)                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ PROCESSO CONCLUÍDO
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         RESULTADO FINAL NO BANCO                         │
│                                                                           │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║                         DOCUMENTO (id: 103)                       ║  │
│  ╠═══════════════════════════════════════════════════════════════════╣  │
│  ║  texto_extraido: "O Sr. João da Silva, CPF 123.456.789-00..."   ║  │
│  ║  ☑ TEXTO ORIGINAL PRESERVADO - NUNCA ALTERADO                   ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                      │                                   │
│                                      │ FK: documento_id                  │
│                                      ▼                                   │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║              DOCUMENTOANONIMIZACAO (id: 42)                       ║  │
│  ╠═══════════════════════════════════════════════════════════════════╣  │
│  ║  documento_id: 103                                                ║  │
│  ║  escritorio_id: 5                                                 ║  │
│  ║  usuario_id: 7                                                    ║  │
│  ║  status: 'concluido'                                              ║  │
│  ║  ┌────────────────────────────────────────────────────────────┐  ║  │
│  ║  │ texto_original: "O Sr. João da Silva, CPF 123..."         │  ║  │
│  ║  │ ☑ BACKUP DO TEXTO COMPLETO                                │  ║  │
│  ║  └────────────────────────────────────────────────────────────┘  ║  │
│  ║  ┌────────────────────────────────────────────────────────────┐  ║  │
│  ║  │ texto_anonimizado: "O Sr. NOME1, CPF1..."                 │  ║  │
│  ║  │ ☑ TEXTO COM PLACEHOLDERS                                  │  ║  │
│  ║  └────────────────────────────────────────────────────────────┘  ║  │
│  ║  data_solicitacao: 2025-10-07 14:30:00                           ║  │
│  ║  data_conclusao: 2025-10-07 14:30:15                             ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                      │                                   │
│                                      │ FK: anonimizacao_id (CASCADE)     │
│                                      ▼                                   │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║                    ANONIMIZACAOITEM (id: 201)                     ║  │
│  ╠═══════════════════════════════════════════════════════════════════╣  │
│  ║  tipo_dado: 'nome'                                                ║  │
│  ║  valor_original: 'João da Silva'      ← MAPEAMENTO REVERSÍVEL    ║  │
│  ║  valor_anonimizado: 'NOME1'                                       ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                           │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║                    ANONIMIZACAOITEM (id: 202)                     ║  │
│  ╠═══════════════════════════════════════════════════════════════════╣  │
│  ║  tipo_dado: 'cpf'                                                 ║  │
│  ║  valor_original: '123.456.789-00'     ← MAPEAMENTO REVERSÍVEL    ║  │
│  ║  valor_anonimizado: 'CPF1'                                        ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                           │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║                    ANONIMIZACAOITEM (id: 203)                     ║  │
│  ╠═══════════════════════════════════════════════════════════════════╣  │
│  ║  tipo_dado: 'endereco'                                            ║  │
│  ║  valor_original: 'Rua das Flores, 123, São Paulo/SP'             ║  │
│  ║  valor_anonimizado: 'ENDERECO1'       ← MAPEAMENTO REVERSÍVEL    ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                           │
│  ... (mais itens conforme necessário)                                    │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Reversão

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      USUÁRIO SOLICITA REVERSÃO                           │
│                   POST /api/documentos/103/restore/                      │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BUSCAR ANONIMIZAÇÃO ATIVA                             │
│                                                                           │
│  DocumentoAnonimizacao.objects.get(                                      │
│    documento_id=103,                                                     │
│    status='concluido'                                                    │
│  )                                                                       │
│  → Encontra: anonimizacao_id = 42                                       │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    RESTAURAR TEXTO ORIGINAL                              │
│                                                                           │
│  documento.texto_extraido = anonimizacao.texto_original                 │
│  documento.save()                                                        │
│                                                                           │
│  ✅ Texto "O Sr. João da Silva, CPF 123.456.789-00..." restaurado!     │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MARCAR COMO REVERTIDO                                 │
│                                                                           │
│  anonimizacao.status = 'revertido'                                      │
│  anonimizacao.data_reversao = NOW()                                     │
│  anonimizacao.save()                                                    │
│                                                                           │
│  ⚠️ Itens de anonimização são MANTIDOS para auditoria                  │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REVERSÃO CONCLUÍDA                               │
│                                                                           │
│  ✅ Documento voltou ao estado original                                │
│  ✅ Histórico de anonimização preservado                               │
│  ✅ Itens mantidos para auditoria                                      │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🗑️ Fluxo de Deleção

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    USUÁRIO SOLICITA DELEÇÃO                              │
│            DELETE /api/documentos/anonymizations/42/delete/              │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONFIRMAR PERMISSÕES                                  │
│                                                                           │
│  - Verificar se anonimizacao_id=42 pertence ao escritório do usuário   │
│  - Verificar se usuário tem permissão                                   │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    DELETAR REGISTRO                                      │
│                                                                           │
│  anonimizacao.delete()                                                  │
│                                                                           │
│  ⚡ CASCADE DELETE:                                                     │
│     - AnonimizacaoItem (id: 201) → DELETADO                            │
│     - AnonimizacaoItem (id: 202) → DELETADO                            │
│     - AnonimizacaoItem (id: 203) → DELETADO                            │
│     - DocumentoAnonimizacao (id: 42) → DELETADO                        │
│                                                                           │
│  ✅ Documento.texto_extraido permanece INTACTO                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DELEÇÃO CONCLUÍDA                                │
│                                                                           │
│  ✅ Registro de anonimização removido                                  │
│  ✅ Todos os itens removidos                                           │
│  ✅ Documento original preservado                                      │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Estados do Sistema

```
DOCUMENTO ORIGINAL (Estado Inicial)
├── texto_extraido: [TEXTO ORIGINAL]
└── Anonimizações: []

        │ ANONIMIZAÇÃO APLICADA
        ▼

DOCUMENTO COM ANONIMIZAÇÃO ATIVA
├── texto_extraido: [TEXTO ORIGINAL] ← NUNCA MUDA!
└── Anonimizações: 
    └── [1] DocumentoAnonimizacao (status: 'concluido')
        ├── texto_original: [BACKUP]
        ├── texto_anonimizado: [COM PLACEHOLDERS]
        └── Itens: [N substituições]

        │ REVERSÃO OU DELEÇÃO
        ▼

DOCUMENTO RESTAURADO
├── texto_extraido: [TEXTO ORIGINAL]
└── Anonimizações:
    └── [1] DocumentoAnonimizacao (status: 'revertido')
        └── Itens: [preservados para auditoria]

    OU (se deletado)

DOCUMENTO ORIGINAL (Após Deleção)
├── texto_extraido: [TEXTO ORIGINAL]
└── Anonimizações: []
```

---

## 🎯 Pontos-Chave de Segurança

✅ **Texto original NUNCA é perdido**
   - Gravado em `DocumentoAnonimizacao.texto_original`
   - `Documento.texto_extraido` permanece intacto

✅ **Mapeamento completo de substituições**
   - Cada `AnonimizacaoItem` registra: original ↔ placeholder
   - Permite auditoria e reversão precisa

✅ **Múltiplas versões possíveis**
   - Um documento pode ter múltiplas anonimizações
   - Cada uma com seu próprio histórico

✅ **Auditoria completa**
   - Quem fez, quando fez, o que configurou
   - Histórico preservado mesmo após reversão

✅ **Isolamento de dados**
   - Escritórios não acessam dados uns dos outros
   - Filtros automáticos em todas as queries

---

**Data**: 07/10/2025  
**Versão**: 1.0
