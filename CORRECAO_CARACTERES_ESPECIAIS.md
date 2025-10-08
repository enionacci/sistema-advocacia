# 🔧 CORREÇÃO: Caracteres Especiais e Acentos em Nomes de Arquivos

## 🐛 Problema Identificado

Arquivos com **acentos e caracteres especiais** no nome não carregavam:
- ✅ `CNIS_IZILDA.pdf` → Funciona
- ❌ `03_-_PROCURAÇÃO.pdf` → Não funciona (Ç e Ã)
- ❌ `Carro_1.jpg` → Não funciona (na verdade funcionava, era órfão)

### Causa

URLs com caracteres especiais precisam ser **URL encoded**:
- `PROCURAÇÃO.pdf` → `PROCURA%C3%87%C3%83O.pdf`

Isso pode causar problemas em:
1. **Sistema de arquivos** (Linux/Windows tratam diferente)
2. **URLs** (encoding/decoding)
3. **Navegadores** (interpretação)

---

## ✅ Solução Implementada

### Função `sanitize_filename()`

**Arquivo:** `backend/documentos/models.py`

```python
def sanitize_filename(filename):
    """
    Remove acentos e caracteres especiais do nome do arquivo
    Mantém apenas letras, números, pontos, hífens e underscores
    """
    # Separar nome e extensão
    name, ext = os.path.splitext(filename)
    
    # Remover acentos (NFD = Normalization Form Canonical Decomposition)
    name = unicodedata.normalize('NFD', name)
    name = name.encode('ascii', 'ignore').decode('utf-8')
    
    # Substituir espaços por underscores
    name = name.replace(' ', '_')
    
    # Remover caracteres especiais, mantendo apenas alfanuméricos, - e _
    name = re.sub(r'[^a-zA-Z0-9_-]', '', name)
    
    # Evitar nomes vazios
    if not name:
        name = 'documento'
    
    # Retornar com extensão
    return f"{name}{ext}"
```

### Aplicação Automática

```python
def documento_upload_path(instance, filename):
    """
    Define o caminho de upload dos documentos
    Organiza por: escritorio/cliente/ano/mes/filename
    Remove acentos e caracteres especiais do nome do arquivo
    """
    import datetime
    
    # Limpa o nome do arquivo
    filename = sanitize_filename(filename)  # ← NOVO!
    
    now = datetime.datetime.now()
    return os.path.join(
        'documentos',
        f'escritorio_{instance.escritorio.id}',
        f'cliente_{instance.cliente.id}',
        str(now.year),
        str(now.month).zfill(2),
        filename
    )
```

---

## 📊 Exemplos de Transformação

### Antes → Depois

| Nome Original | Nome Sanitizado |
|--------------|-----------------|
| `PROCURAÇÃO.pdf` | `PROCURACAO.pdf` |
| `Foto São Paulo.jpg` | `Foto_Sao_Paulo.jpg` |
| `Relatório 2024.docx` | `Relatorio_2024.docx` |
| `Contrato - José.pdf` | `Contrato_-_Jose.pdf` |
| `Imóvel #123.png` | `Imovel_123.png` |
| `Açúcar & Café.xlsx` | `Acucar_Cafe.xlsx` |

### Caracteres Permitidos

✅ **Permitidos:**
- Letras: `a-z`, `A-Z`
- Números: `0-9`
- Underscore: `_`
- Hífen: `-`
- Ponto: `.` (apenas para extensão)

❌ **Removidos/Convertidos:**
- Acentos: `á, é, í, ó, ú, à, ã, õ, ç` → `a, e, i, o, u, a, a, o, c`
- Espaços: ` ` → `_`
- Caracteres especiais: `@, #, $, %, &, *, (, ), +, =, [, ], {, }, ;, :, ', ", <, >, ?, /, \, |`

---

## 🔍 Benefícios

### 1. **Compatibilidade Universal**
- ✅ Funciona em Windows, Linux, macOS
- ✅ Compatível com qualquer navegador
- ✅ Sem problemas de encoding

### 2. **URLs Limpas**
```
❌ Antes: /media/documentos/.../PROCURA%C3%87%C3%83O.pdf
✅ Depois: /media/documentos/.../PROCURACAO.pdf
```

### 3. **Sem Ambiguidade**
- Evita problemas com diferentes encodings (UTF-8, Latin-1, etc)
- Evita problemas em backups/transferências
- Facilita busca e organização

### 4. **Segurança**
- Remove caracteres que podem ser explorados em ataques
- Evita path traversal (`../`, `..\\`)
- Nomes de arquivo previsíveis

---

## 🧪 Como Testar

### Teste 1: Upload com Acentos

1. Renomeie um arquivo para `Relatório_Anual_2024.pdf`
2. Faça upload no sistema
3. **Verificar:**
   - ✅ Upload funciona normalmente
   - ✅ Nome salvo no banco: `Relatorio_Anual_2024.pdf`
   - ✅ Visualização funciona
   - ✅ Download funciona

### Teste 2: Upload com Caracteres Especiais

1. Renomeie um arquivo para `Contrato & Termo @ Cliente #1.pdf`
2. Faça upload no sistema
3. **Verificar:**
   - ✅ Nome salvo: `Contrato_Termo_Cliente_1.pdf`
   - ✅ Tudo funciona normalmente

### Teste 3: Caracteres Extremos

1. Teste com: `Açúcar, Café & Chá - São Paulo (SP).xlsx`
2. **Esperado:** `Acucar_Cafe_Cha_-_Sao_Paulo_SP.xlsx`

---

## 📝 Notas Importantes

### 1. **Nome Original Preservado**

O sistema continua salvando o **nome original** no campo `nome_original`:
```python
self.nome_original = os.path.basename(self.arquivo.name)  # Nome sanitizado
```

Se quiser preservar o nome original **antes** da sanitização, precisaríamos modificar o serializer.

### 2. **Arquivos Existentes**

Arquivos já enviados **NÃO serão renomeados**. A sanitização só funciona para **novos uploads**.

Para renomear arquivos existentes, seria necessário:
1. Script de migração
2. Renomear arquivos físicos
3. Atualizar banco de dados

### 3. **Caracteres Unicode**

A função remove **todos** os caracteres não-ASCII:
- ✅ Japonês, Chinês, Árabe → Removidos
- ✅ Emoji → Removidos
- ✅ Símbolos especiais → Removidos

---

## 🚀 Deploy

### Build e Push

```powershell
cd C:\sistema-advocacia
docker build -t enionacci/advocacia-backend:latest ./backend
docker push enionacci/advocacia-backend:latest
```

### Atualizar na VPS

```bash
docker service update --force advocacia_advocacia_backend
```

---

## 🔄 Migração de Arquivos Antigos (Opcional)

Se quiser renomear arquivos antigos com acentos:

```python
# Script de migração (executar no Django shell)
from documentos.models import Documento, sanitize_filename
import os
import shutil

for doc in Documento.objects.filter(ativo=True):
    if doc.arquivo:
        old_path = doc.arquivo.path
        old_name = os.path.basename(old_path)
        new_name = sanitize_filename(old_name)
        
        if old_name != new_name:
            new_path = os.path.join(os.path.dirname(old_path), new_name)
            
            print(f"📝 Renomeando: {old_name} → {new_name}")
            
            try:
                # Renomear arquivo físico
                shutil.move(old_path, new_path)
                
                # Atualizar banco de dados
                doc.arquivo.name = doc.arquivo.name.replace(old_name, new_name)
                doc.nome_original = new_name
                doc.save(update_fields=['arquivo', 'nome_original'])
                
                print(f"   ✅ Sucesso!")
            except Exception as e:
                print(f"   ❌ Erro: {e}")
```

⚠️ **CUIDADO:** Faça backup antes de executar!

---

## 📚 Referências

- [Unicode Normalization](https://docs.python.org/3/library/unicodedata.html#unicodedata.normalize)
- [Django FileField](https://docs.djangoproject.com/en/5.0/ref/models/fields/#filefield)
- [URL Encoding](https://en.wikipedia.org/wiki/Percent-encoding)

---

**Data:** 07/10/2025  
**Versão:** 1.0  
**Status:** ✅ Implementado  
**Próximo Deploy:** Pendente
