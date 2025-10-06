# Instalação e Configuração do Scanner & IA

## 📋 Requisitos do Sistema

### 1. Tesseract OCR
O Tesseract é necessário para extrair texto de PDFs e imagens.

#### Windows:
1. Baixe o instalador: https://github.com/UB-Mannheim/tesseract/wiki
2. Execute o instalador
3. **IMPORTANTE**: Durante a instalação, marque "Additional language data" e selecione **Portuguese**
4. Anote o caminho de instalação (geralmente `C:\Program Files\Tesseract-OCR\`)

#### Configuração no Código:
Após instalar, adicione ao arquivo `ai_service.py` (linha ~40):

```python
# No Windows, defina o caminho do Tesseract
import platform
if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### 2. Poppler (para converter PDF em imagens)

#### Windows:
1. Baixe o Poppler: http://blog.alivate.com.au/poppler-windows/
2. Extraia o arquivo ZIP
3. Adicione o caminho `poppler-xx\Library\bin` ao PATH do sistema

**OU** instale via Chocolatey:
```powershell
choco install poppler
```

### 3. API Key da OpenAI

1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova API Key
3. No sistema:
   - Vá em "Meu Escritório"
   - Na seção "Configurações da IA", adicione a chave API
   - Salve

**IMPORTANTE**: A chave é armazenada criptografada no banco de dados.

---

## 🚀 Como Usar o Scanner & IA

### Passo 1: Escanear Documento

1. Acesse o menu lateral **"Scanner & IA" → "Escanear Documento"**
2. Clique em "Selecionar Arquivo"
3. Escolha um PDF ou imagem (JPG, PNG, TIFF, BMP)
4. Clique em "Extrair Texto (OCR)"
5. Aguarde o processamento (pode levar alguns segundos)

### Passo 2: Revisar Texto Extraído

1. O texto extraído aparecerá em um campo editável
2. Você pode editar o texto se necessário
3. Clique em "Prosseguir para Análise"

### Passo 3: Configurar Análise IA

1. Selecione o tipo de análise:
   - **Resumo Executivo**: Resumo conciso do documento
   - **Extração de Dados**: Extrai informações estruturadas (nomes, datas, valores, etc.)
   - **Análise Jurídica**: Análise sob perspectiva jurídica
   - **Análise de Contrato**: Identifica cláusulas, riscos e obrigações
   - **Análise de Risco**: Identifica riscos, alertas e recomendações
   - **Personalizado**: Análise com instruções customizadas

2. Se escolher "Personalizado", forneça instruções detalhadas

3. Clique em "Solicitar Análise IA"

### Passo 4: Acompanhar Análises

1. Acesse **"Scanner & IA" → "Análises Realizadas"**
2. Visualize o status das análises:
   - 🔵 Pendente
   - 🔄 Processando
   - ✅ Concluído
   - ❌ Erro

3. Clique no ícone 👁️ para ver detalhes da análise
4. Veja informações como:
   - Resultado completo
   - Tempo de processamento
   - Tokens utilizados
   - Custo estimado (USD)
   - Modelo IA usado

---

## 🔒 Permissões

O sistema possui 5 novas permissões para controlar o acesso:

1. **escanear_documento**: Permite escanear documentos e extrair texto
2. **solicitar_analise_ia**: Permite solicitar análises com IA
3. **ver_analise_ia**: Permite visualizar análises existentes
4. **editar_analise_ia**: Permite editar análises
5. **deletar_analise_ia**: Permite excluir análises

Configure essas permissões em:
**Meu Escritório → Papéis e Permissões**

---

## 💰 Custos da API

O sistema rastreia automaticamente:
- **Tokens usados**: Quantidade de tokens processados
- **Custo estimado**: Valor em USD da análise

### Preços GPT-4 (referência):
- Input: ~$0.03 / 1K tokens
- Output: ~$0.06 / 1K tokens

**Exemplo**: Um documento de 2 páginas (~1000 palavras) geralmente consome:
- ~1500 tokens de input
- ~500 tokens de output
- **Custo aproximado**: $0.06 - $0.10

---

## 🧪 Testando o Sistema

### 1. Teste com Documento Real

1. Escaneie um documento físico em PDF
2. Faça upload no sistema
3. Extraia o texto com OCR
4. Solicite uma análise jurídica

### 2. Teste com Arquivo Digital

1. Use um contrato PDF digital
2. Faça upload (OCR ainda funciona)
3. Solicite análise de contrato
4. Veja cláusulas e riscos identificados

### 3. Teste Personalizado

1. Prepare um documento específico
2. Use análise "Personalizado"
3. Instrua a IA: "Liste todos os valores monetários mencionados, com suas respectivas datas e responsáveis"
4. Veja o resultado estruturado

---

## 🐛 Troubleshooting

### Erro: "Tesseract not found"
- Verifique se o Tesseract está instalado
- Confirme o caminho no código (`pytesseract.tesseract_cmd`)
- Reinicie o servidor Django

### Erro: "Unable to get page count"
- Verifique se o Poppler está instalado
- Adicione o caminho do Poppler ao PATH do Windows
- Reinicie o terminal/sistema

### Erro: "API Key da OpenAI não configurada"
- Acesse "Meu Escritório"
- Adicione sua API Key da OpenAI
- Salve e tente novamente

### Análise demora muito
- Normal para documentos grandes (>5 páginas)
- GPT-4 pode levar 30-60 segundos
- Acompanhe o status na página de análises

### Erro de permissão
- Verifique se seu usuário tem as permissões necessárias
- Solicite ao administrador do escritório

---

## 📊 Monitoramento

O sistema mantém log completo de:
- ✅ Todas as análises realizadas
- 📈 Tempo de processamento
- 💵 Custos acumulados
- 🔍 Textos extraídos
- ❌ Erros e tentativas

Acesse **"Auditoria" → "Logs do Sistema"** para ver histórico completo.

---

## 🎯 Melhores Práticas

1. **OCR**: Use imagens de alta qualidade para melhor extração
2. **IA**: Seja específico nas instruções personalizadas
3. **Revisão**: Sempre revise o texto extraído antes de enviar para IA
4. **Custos**: Monitore os custos mensais na OpenAI
5. **Documentos**: Organize os documentos por categoria/cliente

---

## 🔄 Próximas Funcionalidades (Roadmap)

- [ ] Processamento em lote (múltiplos documentos)
- [ ] Exportação de análises em PDF/DOCX
- [ ] Comparação entre versões de documentos
- [ ] Dashboard de custos e uso da IA
- [ ] Integração com outros modelos (Claude, Gemini)
- [ ] OCR com correção automática
- [ ] Templates de análise personalizados
