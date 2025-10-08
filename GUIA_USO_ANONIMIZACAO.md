# 🎯 Como Usar a Anonimização - Guia do Usuário

## 📍 Localização
**Menu**: Sistema → Anonimização de Documentos

---

## ✅ Passo a Passo: Como Anonimizar um Documento

### **1. Acessar a Página de Anonimização**

Na página você verá **2 seções**:

```
┌────────────────────────────────────────────────────────────┐
│  📄 Documentos Disponíveis     │  🔒 Histórico             │
│  (documentos com texto)        │  (anonimizações feitas)    │
└────────────────────────────────────────────────────────────┘
```

---

### **2. Selecionar um Documento para Anonimizar**

Na coluna **"📄 Documentos Disponíveis"**:
- Procure o documento que deseja anonimizar
- Clique no botão **"Anonimizar"** (azul com ícone de cadeado)

![image](https://user-images.githubusercontent.com/placeholder/anonimizar-button.png)

---

### **3. Confirmar a Anonimização**

Um dialog será aberto mostrando:

```
┌─────────────────────────────────────────┐
│  🔒 Configurar Anonimização            │
├─────────────────────────────────────────┤
│  Documento: Petição Inicial...         │
│                                         │
│  ℹ️ Anonimização com IA (Hugging Face)│
│                                         │
│  Tipos de Dados que serão Anonimizados:│
│  ✓ Nomes                               │
│  ✓ CPF e RG                            │
│  ✓ Endereços                           │
│  ✓ E-mails                             │
│  ✓ Telefones                           │
│                                         │
│  [Cancelar] [Anonimizar Documento]     │
└─────────────────────────────────────────┘
```

**Clique em** → **"Anonimizar Documento"**

---

### **4. Aguardar o Processamento**

- Uma mensagem "Anonimizando..." aparecerá
- O processo pode levar alguns segundos (dependendo do tamanho do documento)
- **AGUARDE até a mensagem de sucesso aparecer**

```
⏳ Processando... Por favor aguarde.
```

---

### **5. Visualizar o Resultado**

Quando concluído, você verá:

#### **Opção A: Popup Automático**
```
┌─────────────────────────────────────────┐
│  ✅ Anonimização concluída com         │
│     15 substituições!                   │
│                                         │
│  Deseja visualizar o resultado agora?  │
│                                         │
│  [OK]  [Cancelar]                      │
└─────────────────────────────────────────┘
```

**Clique em "OK"** para ver imediatamente o texto anonimizado.

#### **Opção B: Visualizar Depois**
Se você clicou em "Cancelar" ou quer ver depois:

1. Vá até o **"🔒 Histórico de Anonimizações"** (coluna direita)
2. Encontre a anonimização na lista
3. Clique no **ícone de olho** (👁️) azul para "Ver Texto Anonimizado"

![image](https://user-images.githubusercontent.com/placeholder/historico-button.png)

---

## 👁️ Visualizar Texto Anonimizado

Quando você clica para visualizar, abre uma tela com **2 colunas**:

```
┌──────────────────────────────────────────────────────────────┐
│  🔒 Comparação: Original vs Anonimizado                      │
│  Documento: Petição Inicial - Cliente João Silva            │
│  Status: Concluído • 15 substituições                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ 📄 Texto Original   │  │ 🔒 Texto Anonimizado │          │
│  │ (Confidencial)      │  │ (LGPD Compliant)     │          │
│  ├─────────────────────┤  ├─────────────────────┤          │
│  │                     │  │                      │          │
│  │ O Sr. João da Silva,│  │ O Sr. NOME1,        │          │
│  │ CPF 123.456.789-00, │  │ CPF1,                │          │
│  │ residente à Rua das │  │ residente à         │          │
│  │ Flores, 123,        │  │ ENDERECO1,          │          │
│  │ São Paulo/SP,       │  │                      │          │
│  │ telefone (11)       │  │ telefone TELEFONE1  │          │
│  │ 98765-4321...       │  │ ...                  │          │
│  │                     │  │                      │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                               │
│  📋 Legenda de Substituições (15 itens) ▼                   │
│  ┌─────────────┬─────────────┬─────────────┐               │
│  │ NOME        │ CPF         │ ENDERECO    │               │
│  │ NOME1       │ CPF1        │ ENDERECO1   │               │
│  │ ← João Silva│ ← 123...    │ ← Rua das..│               │
│  └─────────────┴─────────────┴─────────────┘               │
│                                                               │
│  [Detalhes Técnicos]  [Fechar]                              │
└──────────────────────────────────────────────────────────────┘
```

### **O que você vê:**

✅ **Coluna Esquerda**: Texto original completo (com dados sensíveis)  
✅ **Coluna Direita**: Texto anonimizado (com placeholders: NOME1, CPF1, etc.)  
✅ **Legenda**: Mostra o mapeamento de cada substituição (até 20 primeiros)

---

## 🔍 Ver Detalhes Técnicos

Se você clicar em **"Detalhes"** (ou **"Detalhes Técnicos"**), verá:

```
┌──────────────────────────────────────────────────────────────┐
│  Detalhes da Anonimização                                    │
├──────────────────────────────────────────────────────────────┤
│  Documento: Petição Inicial - Cliente João Silva            │
│  Status: Concluído                                           │
│  Método: 🤖 Inteligência Artificial                         │
│  Substituições: 15                                           │
│                                                               │
│  📋 Itens Substituídos (15) ▼                               │
│  • NOME: João da Silva → NOME1                              │
│    Contexto: O Sr. João da Silva, CPF 123                   │
│                                                               │
│  • CPF: 123.456.789-00 → CPF1                               │
│    Contexto: Silva, CPF 123.456.789-00, residente           │
│                                                               │
│  • ENDERECO: Rua das Flores, 123, São Paulo/SP → ENDERECO1 │
│    Contexto: residente à Rua das Flores, 123...            │
│                                                               │
│  ... (todos os itens)                                        │
│                                                               │
│  Configuração Utilizada:                                     │
│  [CPF/RG] [E-mails] [Telefones] [Nomes] [Endereços]       │
│                                                               │
│  [Deletar Registro]  [Fechar]                               │
└──────────────────────────────────────────────────────────────┘
```

**Aqui você pode**:
- Ver **TODOS os itens substituídos** (não apenas os 20 primeiros)
- Ver o **contexto** de cada substituição
- **Deletar o registro** de anonimização (se necessário)

---

## 🔄 Como Restaurar o Documento Original

Se você quiser **reverter** a anonimização e voltar ao texto original:

### **Método 1: Pela lista de documentos**
1. Na coluna **"📄 Documentos Disponíveis"**
2. Documentos anonimizados aparecem com chip **"Anonimizado"** (laranja)
3. Clique no botão **"Restaurar"** (ícone de voltar)
4. Confirme a ação

### **Resultado**:
✅ O documento volta ao estado original  
✅ O histórico de anonimização é preservado (marcado como "Revertido")

---

## 🗑️ Como Deletar um Registro de Anonimização

Se você quiser **remover completamente** um registro de anonimização:

1. Vá até **"🔒 Histórico de Anonimizações"**
2. Clique em **"Detalhes"** na anonimização desejada
3. No dialog, clique em **"Deletar Registro"** (botão vermelho)
4. Confirme a deleção

### **O que acontece**:
✅ O registro de anonimização é deletado  
✅ Todos os itens de substituição são deletados  
⚠️ **O documento original é preservado** (não é afetado)

---

## ❓ Perguntas Frequentes

### **1. Onde fica o texto anonimizado?**
**R:** O texto anonimizado fica gravado em `DocumentoAnonimizacao.texto_anonimizado` no banco de dados. Você pode visualizá-lo:
- Clicando no **ícone de olho** (👁️) no histórico
- Através da tela de comparação (Original vs Anonimizado)

### **2. O texto original é alterado?**
**R:** **NÃO!** O texto original do documento (`Documento.texto_extraido`) **NUNCA é alterado**. A anonimização cria um registro separado com o texto anonimizado.

### **3. Posso ter múltiplas anonimizações do mesmo documento?**
**R:** Sim! Você pode criar várias versões anonimizadas do mesmo documento, cada uma ficará registrada no histórico.

### **4. Como sei se a anonimização deu certo?**
**R:** Após o processo:
1. Aparece uma mensagem de sucesso com o número de substituições
2. Um popup pergunta se você quer ver o resultado
3. O histórico mostra o status "Concluído" com chip verde
4. Você pode visualizar o texto anonimizado a qualquer momento

### **5. O que acontece se der erro?**
**R:** Se der erro:
- O status será marcado como "Erro" com chip vermelho
- A mensagem de erro aparecerá no histórico
- O documento original permanece intacto
- Você pode tentar novamente

### **6. Posso compartilhar o texto anonimizado?**
**R:** Sim! O texto anonimizado está em conformidade com a LGPD e pode ser compartilhado pois não contém dados pessoais identificáveis. Você pode:
- Copiar o texto da tela de visualização
- Exportar através da API (se implementado)

### **7. Como funciona a reversão?**
**R:** A reversão é simples:
- O sistema pega o texto original que foi salvo como backup
- Restaura no documento
- Marca a anonimização como "Revertida"
- Todo o histórico é preservado para auditoria

### **8. Quanto tempo leva o processo?**
**R:** Depende do tamanho do documento:
- Documentos pequenos (1-3 páginas): 5-15 segundos
- Documentos médios (4-10 páginas): 15-30 segundos
- Documentos grandes (>10 páginas): 30-60 segundos

### **9. Posso cancelar o processo?**
**R:** Não é possível cancelar após iniciar. O processo é rápido e seguro, mas se houver problema, o status será marcado como "Erro" automaticamente.

### **10. Onde vejo o histórico completo?**
**R:** Na coluna **"🔒 Histórico de Anonimizações"** você vê:
- Todas as anonimizações do seu escritório
- Status de cada uma (Concluído, Erro, Revertido)
- Data e hora de cada operação
- Usuário que solicitou
- Número de substituições

---

## 🎯 Resumo Visual do Fluxo

```
1. SELECIONAR DOCUMENTO
   ↓
2. CLICAR EM "Anonimizar"
   ↓
3. CONFIRMAR CONFIGURAÇÕES
   ↓
4. AGUARDAR PROCESSAMENTO (5-60s)
   ↓
5. VER RESULTADO
   ├─→ POPUP: "Deseja ver agora?" → [SIM] → Tela de Comparação
   └─→ OU: Ver depois no Histórico → Clique no 👁️
   ↓
6. VISUALIZAR
   ├─→ Texto Original vs Anonimizado (lado a lado)
   ├─→ Legenda de substituições
   └─→ Detalhes técnicos
   ↓
7. AÇÕES DISPONÍVEIS
   ├─→ Restaurar (se quiser voltar ao original)
   └─→ Deletar registro (se não precisar mais)
```

---

## 🔐 Segurança e LGPD

✅ **Texto original sempre preservado**  
✅ **Anonimização reversível e auditável**  
✅ **Isolamento por escritório (multi-tenant)**  
✅ **Histórico completo de operações**  
✅ **Conformidade com LGPD**

---

## 💡 Dicas

1. **Visualize sempre**: Após anonimizar, sempre confira o resultado
2. **Teste primeiro**: Teste com um documento pequeno antes de processar lotes grandes
3. **Mantenha o histórico**: Não delete registros antigos sem necessidade (bom para auditoria)
4. **Aguarde o processo**: Não feche a janela durante o processamento

---

**Data**: 07/10/2025  
**Versão**: 2.0 - Com visualização de textos
