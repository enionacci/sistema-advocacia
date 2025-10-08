# 💻 Exemplos de Código - Anonimização

## 🔍 Consultas e Operações Comuns

### 1. Buscar Todas as Anonimizações de um Documento

```python
# backend/documentos/views.py ou shell

from documentos.models import DocumentoAnonimizacao

documento_id = 103

# Buscar todas as anonimizações (incluindo revertidas e deletadas se aplicável)
anonimizacoes = DocumentoAnonimizacao.objects.filter(
    documento_id=documento_id
).select_related('usuario', 'documento').order_by('-data_solicitacao')

for anon in anonimizacoes:
    print(f"ID: {anon.id}")
    print(f"Status: {anon.status}")
    print(f"Data: {anon.data_solicitacao}")
    print(f"Usuário: {anon.usuario.get_full_name()}")
    print(f"Total de substituições: {anon.itens.count()}")
    print("---")
```

---

### 2. Ver Todos os Itens de Substituição

```python
from documentos.models import AnonimizacaoItem

anonimizacao_id = 42

# Buscar todos os itens de substituição
itens = AnonimizacaoItem.objects.filter(
    anonimizacao_id=anonimizacao_id
).order_by('posicao_inicio')

print(f"Total de substituições: {itens.count()}\n")

for item in itens:
    print(f"Tipo: {item.get_tipo_dado_display()}")
    print(f"Original: {item.valor_original}")
    print(f"Anonimizado: {item.valor_anonimizado}")
    print(f"Contexto: {item.contexto}")
    print("---")
```

**Saída Esperada:**
```
Total de substituições: 5

Tipo: Nome
Original: João da Silva
Anonimizado: NOME1
Contexto: O Sr. João da Silva, CPF 123
---
Tipo: CPF
Original: 123.456.789-00
Anonimizado: CPF1
Contexto: Silva, CPF 123.456.789-00, residente
---
...
```

---

### 3. Estatísticas de Substituições por Tipo

```python
from django.db.models import Count
from documentos.models import AnonimizacaoItem

anonimizacao_id = 42

# Contar substituições por tipo
stats = AnonimizacaoItem.objects.filter(
    anonimizacao_id=anonimizacao_id
).values('tipo_dado').annotate(
    total=Count('id')
).order_by('-total')

print("Estatísticas de Anonimização:")
print("=" * 40)
for stat in stats:
    tipo_display = dict(AnonimizacaoItem.TIPO_DADO_CHOICES).get(
        stat['tipo_dado'], 
        stat['tipo_dado']
    )
    print(f"{tipo_display}: {stat['total']} ocorrências")
```

**Saída Esperada:**
```
Estatísticas de Anonimização:
========================================
Nome: 12 ocorrências
CPF: 8 ocorrências
Endereço: 5 ocorrências
Telefone: 3 ocorrências
E-mail: 2 ocorrências
```

---

### 4. Comparar Texto Original vs Anonimizado

```python
from documentos.models import DocumentoAnonimizacao

anonimizacao = DocumentoAnonimizacao.objects.get(id=42)

print("=" * 80)
print("TEXTO ORIGINAL (primeiros 500 chars):")
print("=" * 80)
print(anonimizacao.texto_original[:500])
print("\n")
print("=" * 80)
print("TEXTO ANONIMIZADO (primeiros 500 chars):")
print("=" * 80)
print(anonimizacao.texto_anonimizado[:500])
print("\n")

# Calcular diferença de tamanho
diff = len(anonimizacao.texto_original) - len(anonimizacao.texto_anonimizado)
print(f"Diferença de tamanho: {diff} caracteres")
```

---

### 5. Verificar Integridade da Anonimização

```python
from documentos.models import DocumentoAnonimizacao, AnonimizacaoItem

def verificar_integridade(anonimizacao_id):
    """
    Verifica se todas as substituições foram aplicadas corretamente
    """
    anon = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
    itens = AnonimizacaoItem.objects.filter(anonimizacao=anon)
    
    print(f"Verificando anonimização ID: {anonimizacao_id}")
    print("=" * 80)
    
    # Verificar se texto anonimizado existe
    if not anon.texto_anonimizado:
        print("❌ ERRO: Texto anonimizado está vazio!")
        return False
    
    # Verificar se há itens
    if itens.count() == 0:
        print("⚠️ AVISO: Nenhum item de substituição encontrado!")
        return False
    
    # Verificar cada substituição
    erros = 0
    for item in itens:
        # Verificar se placeholder existe no texto anonimizado
        if item.valor_anonimizado not in anon.texto_anonimizado:
            print(f"❌ Placeholder '{item.valor_anonimizado}' não encontrado no texto anonimizado")
            erros += 1
        
        # Verificar se valor original NÃO existe no texto anonimizado
        if item.valor_original in anon.texto_anonimizado:
            print(f"⚠️ Valor original '{item.valor_original}' ainda presente no texto anonimizado!")
            erros += 1
    
    if erros == 0:
        print(f"✅ Integridade OK: {itens.count()} substituições verificadas")
        return True
    else:
        print(f"❌ Encontrados {erros} problemas")
        return False

# Uso
verificar_integridade(42)
```

---

### 6. Exportar Mapeamento de Anonimização (CSV)

```python
import csv
from documentos.models import AnonimizacaoItem

def exportar_mapeamento(anonimizacao_id, arquivo_saida):
    """
    Exporta o mapeamento de substituições para CSV
    """
    itens = AnonimizacaoItem.objects.filter(
        anonimizacao_id=anonimizacao_id
    ).order_by('tipo_dado', 'posicao_inicio')
    
    with open(arquivo_saida, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Cabeçalho
        writer.writerow([
            'Tipo', 
            'Valor Original', 
            'Valor Anonimizado', 
            'Posição Início', 
            'Posição Fim', 
            'Contexto'
        ])
        
        # Dados
        for item in itens:
            writer.writerow([
                item.get_tipo_dado_display(),
                item.valor_original,
                item.valor_anonimizado,
                item.posicao_inicio or '',
                item.posicao_fim or '',
                item.contexto
            ])
    
    print(f"✅ Mapeamento exportado para: {arquivo_saida}")
    print(f"Total de itens: {itens.count()}")

# Uso
exportar_mapeamento(42, 'mapeamento_anonimizacao_42.csv')
```

---

### 7. Reverter Anonimização Manualmente

```python
from django.utils import timezone
from documentos.models import DocumentoAnonimizacao

def reverter_anonimizacao(anonimizacao_id):
    """
    Reverte uma anonimização manualmente
    """
    anon = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
    
    if anon.status != 'concluido':
        print(f"❌ Anonimização não está no status 'concluido' (atual: {anon.status})")
        return False
    
    # Restaurar texto original no documento
    documento = anon.documento
    documento.texto_extraido = anon.texto_original
    documento.save()
    
    # Marcar como revertido
    anon.status = 'revertido'
    anon.data_reversao = timezone.now()
    anon.save()
    
    print(f"✅ Anonimização {anonimizacao_id} revertida com sucesso")
    print(f"   Documento ID: {documento.id}")
    print(f"   Título: {documento.titulo}")
    return True

# Uso
reverter_anonimizacao(42)
```

---

### 8. Buscar Documentos com Anonimização Ativa

```python
from documentos.models import Documento, DocumentoAnonimizacao

def listar_documentos_anonimizados(escritorio_id):
    """
    Lista todos os documentos que possuem anonimização ativa
    """
    anonimizacoes_ativas = DocumentoAnonimizacao.objects.filter(
        escritorio_id=escritorio_id,
        status='concluido'
    ).values_list('documento_id', flat=True)
    
    documentos = Documento.objects.filter(
        id__in=anonimizacoes_ativas
    ).select_related('cliente')
    
    print(f"Documentos com Anonimização Ativa no Escritório {escritorio_id}:")
    print("=" * 80)
    
    for doc in documentos:
        # Buscar anonimização ativa
        anon = DocumentoAnonimizacao.objects.get(
            documento=doc,
            status='concluido'
        )
        
        print(f"ID: {doc.id}")
        print(f"Título: {doc.titulo}")
        print(f"Cliente: {doc.cliente.nome_completo if doc.cliente else 'N/A'}")
        print(f"Anonimização ID: {anon.id}")
        print(f"Data: {anon.data_conclusao}")
        print(f"Substituições: {anon.itens.count()}")
        print("---")
    
    return documentos

# Uso
listar_documentos_anonimizados(escritorio_id=5)
```

---

### 9. Reconstruir Texto Original a partir dos Itens

```python
from documentos.models import DocumentoAnonimizacao, AnonimizacaoItem

def reconstruir_texto_original(anonimizacao_id):
    """
    Reconstrói o texto original a partir do texto anonimizado e dos itens
    (útil para validação)
    """
    anon = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
    itens = AnonimizacaoItem.objects.filter(anonimizacao=anon)
    
    # Começar com texto anonimizado
    texto_reconstruido = anon.texto_anonimizado
    
    # Aplicar substituições reversas (placeholder → original)
    for item in itens:
        texto_reconstruido = texto_reconstruido.replace(
            item.valor_anonimizado,
            item.valor_original
        )
    
    # Comparar com texto original gravado
    if texto_reconstruido == anon.texto_original:
        print("✅ Reconstrução perfeita! Texto reconstruído = Texto original")
        return True
    else:
        print("⚠️ Diferenças encontradas entre texto reconstruído e original")
        print(f"Tamanho original: {len(anon.texto_original)}")
        print(f"Tamanho reconstruído: {len(texto_reconstruido)}")
        
        # Mostrar primeiras diferenças
        for i, (char_orig, char_rec) in enumerate(zip(anon.texto_original, texto_reconstruido)):
            if char_orig != char_rec:
                print(f"Primeira diferença na posição {i}:")
                print(f"  Original: '{anon.texto_original[i:i+50]}'")
                print(f"  Reconstruído: '{texto_reconstruido[i:i+50]}'")
                break
        
        return False

# Uso
reconstruir_texto_original(42)
```

---

### 10. Deletar Anonimizações Antigas

```python
from datetime import timedelta
from django.utils import timezone
from documentos.models import DocumentoAnonimizacao

def limpar_anonimizacoes_antigas(dias=90, dry_run=True):
    """
    Remove anonimizações antigas (revertidas ou com erro)
    
    Args:
        dias: Número de dias para considerar "antiga"
        dry_run: Se True, apenas mostra o que seria deletado
    """
    data_limite = timezone.now() - timedelta(days=dias)
    
    # Buscar anonimizações antigas revertidas ou com erro
    anonimizacoes = DocumentoAnonimizacao.objects.filter(
        data_solicitacao__lt=data_limite,
        status__in=['revertido', 'erro']
    )
    
    total = anonimizacoes.count()
    
    print(f"Anonimizações encontradas com mais de {dias} dias:")
    print(f"Total: {total}")
    print("=" * 80)
    
    if total == 0:
        print("Nenhuma anonimização antiga encontrada.")
        return
    
    for anon in anonimizacoes[:10]:  # Mostrar apenas primeiras 10
        print(f"ID: {anon.id} | Documento: {anon.documento.titulo} | "
              f"Status: {anon.status} | Data: {anon.data_solicitacao}")
    
    if total > 10:
        print(f"... e mais {total - 10} registros")
    
    print("=" * 80)
    
    if dry_run:
        print("⚠️ DRY RUN - Nada foi deletado")
        print(f"Execute com dry_run=False para deletar {total} registros")
    else:
        confirmacao = input(f"Confirma deleção de {total} registros? (sim/não): ")
        if confirmacao.lower() == 'sim':
            anonimizacoes.delete()
            print(f"✅ {total} anonimizações antigas deletadas")
        else:
            print("❌ Operação cancelada")

# Uso
limpar_anonimizacoes_antigas(dias=90, dry_run=True)  # Teste
# limpar_anonimizacoes_antigas(dias=90, dry_run=False)  # Executar
```

---

### 11. Auditoria: Quem Anonimizou o Quê

```python
from datetime import datetime, timedelta
from django.db.models import Count
from documentos.models import DocumentoAnonimizacao

def relatorio_auditoria(escritorio_id, dias=30):
    """
    Gera relatório de auditoria de anonimizações
    """
    data_inicio = timezone.now() - timedelta(days=dias)
    
    anonimizacoes = DocumentoAnonimizacao.objects.filter(
        escritorio_id=escritorio_id,
        data_solicitacao__gte=data_inicio
    ).select_related('usuario', 'documento')
    
    print(f"Relatório de Anonimizações - Últimos {dias} dias")
    print(f"Escritório ID: {escritorio_id}")
    print("=" * 80)
    
    # Total por usuário
    por_usuario = anonimizacoes.values(
        'usuario__first_name', 
        'usuario__last_name'
    ).annotate(
        total=Count('id')
    ).order_by('-total')
    
    print("\nAnonimizações por Usuário:")
    for item in por_usuario:
        nome = f"{item['usuario__first_name']} {item['usuario__last_name']}"
        print(f"  {nome}: {item['total']} anonimizações")
    
    # Total por status
    por_status = anonimizacoes.values('status').annotate(
        total=Count('id')
    ).order_by('-total')
    
    print("\nAnonimizações por Status:")
    for item in por_status:
        print(f"  {item['status']}: {item['total']}")
    
    # Últimas anonimizações
    print("\nÚltimas 10 Anonimizações:")
    for anon in anonimizacoes.order_by('-data_solicitacao')[:10]:
        print(f"  {anon.data_solicitacao.strftime('%d/%m/%Y %H:%M')} | "
              f"{anon.usuario.get_full_name()} | "
              f"{anon.documento.titulo[:40]} | "
              f"{anon.status}")

# Uso
relatorio_auditoria(escritorio_id=5, dias=30)
```

---

### 12. API: Buscar Detalhes de Anonimização (Frontend)

```javascript
// frontend/src/utils/anonymizationAPI.js

import axios from './axiosInstance';

/**
 * Busca detalhes completos de uma anonimização
 */
export const getAnonymizationDetails = async (anonimizacaoId) => {
  try {
    const response = await axios.get(
      `/api/documentos/anonymizations/${anonimizacaoId}/`
    );
    
    console.log('Detalhes da Anonimização:', response.data.data);
    
    return {
      success: true,
      data: response.data.data
    };
    
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Erro desconhecido'
    };
  }
};

/**
 * Deleta um registro de anonimização
 */
export const deleteAnonymization = async (anonimizacaoId) => {
  if (!window.confirm('Confirma a deleção deste registro?')) {
    return { success: false, cancelled: true };
  }
  
  try {
    const response = await axios.delete(
      `/api/documentos/anonymizations/${anonimizacaoId}/delete/`
    );
    
    return {
      success: true,
      message: response.data.message
    };
    
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Erro ao deletar'
    };
  }
};

/**
 * Restaura documento anonimizado
 */
export const restoreDocument = async (documentoId) => {
  try {
    const response = await axios.post(
      `/api/documentos/${documentoId}/restore/`
    );
    
    return {
      success: true,
      message: response.data.message
    };
    
  } catch (error) {
    console.error('Erro ao restaurar:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Erro ao restaurar'
    };
  }
};

// Uso no componente React:
// import { getAnonymizationDetails, deleteAnonymization } from './utils/anonymizationAPI';
//
// const details = await getAnonymizationDetails(42);
// const result = await deleteAnonymization(42);
```

---

## 🔍 Queries SQL Diretas

### Buscar todas as anonimizações com contagem de itens
```sql
SELECT 
    da.id,
    da.status,
    d.titulo AS documento,
    u.first_name || ' ' || u.last_name AS usuario,
    da.data_solicitacao,
    COUNT(ai.id) AS total_substituicoes
FROM documentos_documentoanonimizacao da
LEFT JOIN documentos_documento d ON da.documento_id = d.id
LEFT JOIN auth_user u ON da.usuario_id = u.id
LEFT JOIN documentos_anonimizacaoitem ai ON ai.anonimizacao_id = da.id
WHERE da.escritorio_id = 5
GROUP BY da.id, da.status, d.titulo, u.first_name, u.last_name, da.data_solicitacao
ORDER BY da.data_solicitacao DESC;
```

### Ver distribuição de tipos de dados anonimizados
```sql
SELECT 
    tipo_dado,
    COUNT(*) as quantidade,
    COUNT(DISTINCT anonimizacao_id) as documentos_afetados
FROM documentos_anonimizacaoitem
GROUP BY tipo_dado
ORDER BY quantidade DESC;
```

---

**Data**: 07/10/2025  
**Versão**: 1.0
