# 🔍 Debug da Anonimização - Checklist

## ❓ Problema: Texto Original e Anonimizado Iguais

Se o texto anonimizado está exatamente igual ao original, siga este checklist:

---

## 📋 Checklist de Verificação

### ✅ **1. Verificar se a IA está respondendo**

**Onde olhar**: Console do backend (terminal onde roda `python manage.py runserver`)

**O que procurar**:
```
🤖 Enviando texto para anonimização via Hugging Face (openai/gpt-oss-120b)
📊 Tamanho do texto: 1234 caracteres
✅ Resposta recebida do Hugging Face
🔍 DEBUG - Primeiros 500 chars da resposta:
[texto da resposta aqui]
```

**Se NÃO aparecer** → IA não está respondendo, verifique:
- Token do Hugging Face está configurado? (`HF_TOKEN` no `.env`)
- Internet está funcionando?
- API do Hugging Face está operacional?

---

### ✅ **2. Verificar formato da resposta da IA**

**Formato esperado**:
```
## TEXTO ANONIMIZADO:
[texto com placeholders]

## DICIONARIO DE VARIAVEIS:
NOME1 → João da Silva Santos
CPF1 → 123.456.789-00
ENDERECO1 → Rua das Flores, 123...
```

**O que procurar no console**:
```
🔍 DEBUG - Resposta da IA completa:
[resposta da IA]

📊 Total de X substituições extraídas
```

**Se mostrar "Total de 0 substituições"** → Parser não está encontrando o dicionário

**Possíveis problemas**:
1. IA respondeu em formato diferente
2. IA não identificou dados pessoais no texto
3. Formato da resposta não tem "→" (seta)

---

### ✅ **3. Verificar se substituições estão sendo aplicadas**

**O que procurar no console**:
```
✅ Substituição 1: 'João da Silva' → 'NOME1' (APLICADA)
✅ Substituição 2: '123.456.789-00' → 'CPF1' (APLICADA)
⚠️ Substituição 3: 'Maria Santos' não encontrado no texto
```

**Se aparecer muitos "não encontrado"**:
- A IA identificou nomes/dados que **não existem** no texto original
- Pode ser alucinação da IA
- Ou a IA extraiu dados formatados diferentemente

---

### ✅ **4. Verificar comparação final**

**O que procurar no console**:
```
📄 Texto final anonimizado (primeiros 300 chars): [texto com NOME1, CPF1...]
📄 Texto original (primeiros 300 chars): [texto com nomes reais...]
🔍 Textos são iguais? False
```

**Se mostrar "True"** → Nenhuma substituição foi aplicada

---

## 🔧 Soluções por Cenário

### **Cenário 1: IA não está respondendo**

**Sintoma**: Não aparece "Resposta recebida do Hugging Face"

**Solução**:
1. Verificar `.env`:
   ```bash
   HF_TOKEN=hf_xxxxxxxxxxxxxxxxxx
   ```

2. Testar token manualmente:
   ```python
   from huggingface_hub import InferenceClient
   
   token = "seu_token_aqui"
   client = InferenceClient(model="openai/gpt-oss-120b", token=token)
   
   response = client.chat_completion(
       messages=[{"role": "user", "content": "Olá"}],
       max_tokens=100
   )
   print(response.choices[0].message.content)
   ```

3. Se falhar → Usar fallback de regex:
   ```python
   # No código, temporariamente forçar regex:
   use_ai = False
   ```

---

### **Cenário 2: IA responde mas formato está errado**

**Sintoma**: "Total de 0 substituições extraídas"

**Solução**: Verificar a resposta da IA no console e ajustar o parser

**Exemplo de resposta problemática**:
```
A IA respondeu:
"Aqui está o texto anonimizado: ..."
(sem as seções ## TEXTO ANONIMIZADO e ## DICIONARIO DE VARIAVEIS)
```

**Fix temporário**: Ajustar o prompt ou usar regex:
```python
# backend/documentos/anonymization_service.py
# Linha ~240
if len(substituicoes) == 0:
    print("⚠️ Nenhuma substituição encontrada pela IA, usando regex")
    return self.detect_and_anonymize_regex(texto)
```

---

### **Cenário 3: Substituições não encontradas no texto**

**Sintoma**: Muitas mensagens "não encontrado no texto"

**Causa**: A IA está "inventando" dados ou usando formato diferente

**Exemplo**:
```
IA identificou: "João Silva"
Mas no texto está: "João da Silva"
```

**Solução**: Melhorar o prompt ou usar regex que é mais preciso

---

### **Cenário 4: Texto muito grande**

**Sintoma**: Timeout ou erro na API

**Solução**: Dividir em chunks
```python
# Adicionar no futuro:
if len(texto) > 50000:
    # Processar em partes de 10000 caracteres
    chunks = [texto[i:i+10000] for i in range(0, len(texto), 10000)]
    # Processar cada chunk...
```

---

## 🧪 Teste Manual Rápido

### **1. Criar documento de teste**

No Django admin, crie um documento com texto simples:
```
O Sr. João da Silva, CPF 123.456.789-00, reside na Rua das Flores, 123.
```

### **2. Tentar anonimizar**

### **3. Verificar console**

Deve aparecer algo como:
```
🤖 Enviando texto para anonimização via Hugging Face
✅ Resposta recebida
📊 Total de 3 substituições extraídas
✅ Substituição 1: 'João da Silva' → 'NOME1' (APLICADA)
✅ Substituição 2: '123.456.789-00' → 'CPF1' (APLICADA)
✅ Substituição 3: 'Rua das Flores, 123' → 'ENDERECO1' (APLICADA)
🔍 Textos são iguais? False
```

### **4. Verificar resultado no frontend**

Abrir a tela de comparação deve mostrar:
```
Original: O Sr. João da Silva, CPF 123.456.789-00...
Anonimizado: O Sr. NOME1, CPF1...
```

---

## 🐛 Forçar Uso de Regex (Fallback)

Se a IA não estiver funcionando, force o uso de regex:

**Opção 1: No código**
```python
# backend/documentos/anonymization_service.py
# Método anonymize_document, linha ~390
use_ai = False  # Força regex
```

**Opção 2: Sem token**
```bash
# .env
# Comente ou remova:
# HF_TOKEN=...
```

**Opção 3: Temporário no serviço**
```python
# Linha ~30
self.client = None  # Desabilita IA temporariamente
```

---

## 📊 Logs Importantes

### **Logs de Sucesso**:
```
🤖 Enviando texto para anonimização
✅ Resposta recebida
📊 Total de X substituições extraídas (X > 0)
✅ Substituição N: 'valor' → 'PLACEHOLDER' (APLICADA)
🔍 Textos são iguais? False
✅ Anonimização concluída: X substituições
```

### **Logs de Problema**:
```
❌ Erro na anonimização com Hugging Face: [erro]
🔄 Usando regex como fallback

OU

📊 Total de 0 substituições extraídas
🔍 Textos são iguais? True
```

---

## 🔍 Comandos de Debug no Python Shell

```python
python manage.py shell

from documentos.models import DocumentoAnonimizacao, AnonimizacaoItem

# Ver última anonimização
anon = DocumentoAnonimizacao.objects.last()

# Verificar textos
print("Original:", anon.texto_original[:200])
print("Anonimizado:", anon.texto_anonimizado[:200])
print("São iguais?", anon.texto_original == anon.texto_anonimizado)

# Ver substituições
itens = AnonimizacaoItem.objects.filter(anonimizacao=anon)
print(f"Total de itens: {itens.count()}")

for item in itens:
    print(f"{item.tipo_dado}: {item.valor_original} → {item.valor_anonimizado}")
```

---

## 📝 Checklist Final

- [ ] Token HF_TOKEN está configurado e válido
- [ ] Console mostra "Resposta recebida do Hugging Face"
- [ ] Console mostra "Total de X substituições extraídas" (X > 0)
- [ ] Console mostra substituições com "(APLICADA)"
- [ ] Console mostra "Textos são iguais? False"
- [ ] Itens salvos no banco (AnonimizacaoItem.count() > 0)
- [ ] Frontend mostra textos diferentes na comparação

Se **TODOS** os itens estiverem OK e ainda assim os textos forem iguais → Há um bug no código de aplicação das substituições.

---

**Data**: 07/10/2025  
**Versão**: 1.0
