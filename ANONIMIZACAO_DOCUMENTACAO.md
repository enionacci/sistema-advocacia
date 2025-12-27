# Sistema de Anonimização de Documentos

## 📋 Visão Geral

O sistema de anonimização foi implementado seguindo o padrão definido em `anonimyze.py`, utilizando o modelo **gpt-oss/120b-cloud** da Hugging Face para anonimização inteligente de dados pessoais em documentos.

## 🔧 Arquitetura

### Componentes Principais

1. **AnonymizationService** (`backend/documentos/anonymization_service.py`)
   - Serviço principal que gerencia a anonimização
   - Suporta dois métodos:
     - **IA (Hugging Face)**: Método principal usando modelo GPT-OSS 120B
     - **Regex**: Método de fallback usando expressões regulares

2. **Views** (`backend/documentos/anonymization_views.py`)
   - `anonymize_document`: Endpoint para anonimizar documentos
   - `restore_document`: Endpoint para restaurar texto original
   - `list_anonymizations`: Lista todas as anonimizações
   - `anonymization_details`: Detalhes de uma anonimização específica

3. **Models** (`backend/documentos/models.py`)
   - `DocumentoAnonimizacao`: Registro de anonimização de documento
   - `AnonimizacaoItem`: Cada substituição individual realizada

## 🔐 Como Funciona

### Método com IA (Recomendado)

1. **Configuração**: 
   - Requer `HF_TOKEN` configurado nas variáveis de ambiente
   - Usa modelo: `gpt-oss/120b-cloud`

2. **Processo**:
   ```python
   prompt = f"""Você é um assistente especializado em anonimização de textos para compliance LGPD.
   
   TAREFA: Anonimize o seguinte texto substituindo os dados pessoais por placeholders...
   
   TIPOS DE DADOS PARA ANONIMIZAR:
   - Nomes de pessoas: NOME1, NOME2, NOME3...
   - CPFs: CPF1, CPF2, CPF3...
   - RGs: RG1, RG2, RG3...
   - Endereços: ENDERECO1, ENDERECO2, ENDERECO3...
   - Telefones: TELEFONE1, TELEFONE2, TELEFONE3...
   - E-mails: EMAIL1, EMAIL2, EMAIL3...
   
   TEXTO ORIGINAL:
   {texto}
   """
   ```

3. **Resposta da IA**:
   - Texto anonimizado completo
   - Lista de substituições no formato: `TIPO|VALOR_ORIGINAL|PLACEHOLDER`

### Método Regex (Fallback)

Se o token Hugging Face não estiver disponível ou ocorrer erro, o sistema usa padrões regex para detectar e anonimizar:

```python
patterns = {
    'cpf': r'\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b',
    'rg': r'\b\d{1,2}\.?\d{3}\.?\d{3}-?[0-9xX]\b',
    'telefone': r'\b(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b',
    'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    'endereco': r'\b(?:Rua|Av|Avenida|Travessa|Alameda|Praça)\s+[^,\n]{5,50}(?:,\s*\d+)?'
}
```

## 📊 Tipos de Dados Anonimizáveis

- ✅ **Nomes de pessoas**
- ✅ **CPFs**
- ✅ **RGs**
- ✅ **Endereços completos**
- ✅ **Telefones**
- ✅ **E-mails**

## 🔄 Reversibilidade

O sistema mantém:
- Texto original preservado
- Mapeamento completo de todas as substituições
- Possibilidade de reverter a anonimização a qualquer momento

## 🚀 Como Usar

### 1. Configurar Token Hugging Face

No Easypanel, adicione a variável de ambiente no **backend**:

```
HF_TOKEN=seu_token_aqui
```

### 2. API Endpoints

#### Anonimizar Documento
```http
POST /api/documentos/{documento_id}/anonymize/
Content-Type: application/json

{
  "tipo": "ia",  // "ia" ou "regex"
  "incluir_nomes": false,
  "incluir_enderecos": false,
  "incluir_emails": true,
  "incluir_telefones": true,
  "incluir_cpf_rg": true
}
```

#### Restaurar Documento
```http
POST /api/documentos/{documento_id}/restore/
```

#### Listar Anonimizações
```http
GET /api/documentos/anonymizations/
```

#### Detalhes de Anonimização
```http
GET /api/documentos/anonymizations/{anonimizacao_id}/
```

## 📝 Exemplo de Uso

**Texto Original:**
```
Fulano de Tal mora na Rua dos Pinheiros, 123, São Paulo – SP. 
Seu CPF é 527.653.851-00 e telefone (11) 98765-4321.
```

**Texto Anonimizado:**
```
NOME1 mora na ENDERECO1. 
Seu CPF é CPF1 e telefone TELEFONE1.
```

**Substituições Registradas:**
```
NOME | Fulano de Tal | NOME1
ENDERECO | Rua dos Pinheiros, 123, São Paulo – SP | ENDERECO1
CPF | 527.653.851-00 | CPF1
TELEFONE | (11) 98765-4321 | TELEFONE1
```

## ⚙️ Configuração de Produção

### 1. Adicionar ao requirements.txt
```
huggingface-hub==0.26.5
```

### 2. Reconstruir imagem Docker
```bash
docker-compose build --no-cache backend
docker push enionacci/advocacia-backend:latest
```

### 3. Configurar no Easypanel
- Adicionar variável `HF_TOKEN` no serviço backend
- Fazer redeploy do backend

## 🔍 Logs e Debugging

O serviço registra logs detalhados:
- `🔒 Iniciando anonimização com IA/Regex`
- `🤖 Enviando texto para Hugging Face`
- `✅ Resposta recebida do Hugging Face`
- `📊 Extraídas X substituições`
- `❌ Erro na anonimização (fallback para regex)`

## 🛡️ Segurança e LGPD

- ✅ Todas as anonimizações são auditadas
- ✅ Usuário e escritório registrados em cada operação
- ✅ Histórico completo de anonimizações e reversões
- ✅ Texto original protegido e acessível apenas para reversão
- ✅ Conformidade com LGPD através de anonimização reversível

## 📚 Referências

- Arquivo base: `sistema-advocacia/anonimyze.py`
- Modelo: [gpt-oss/120b-cloud](https://huggingface.co/gpt-oss/120b-cloud)
- Documentação Hugging Face: https://huggingface.co/docs/huggingface_hub
