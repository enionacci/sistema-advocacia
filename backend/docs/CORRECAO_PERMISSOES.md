# Correção do Erro de Permissões - tem_permissao

## ❌ Erro Encontrado

```
AttributeError: 'PerfilUsuario' object has no attribute 'tem_permissao'
```

## ✅ Solução Implementada

Foi adicionado o método `tem_permissao()` ao modelo `PerfilUsuario` em `escritorios/models.py`.

### Código Adicionado:

```python
def tem_permissao(self, codename):
    """
    Verifica se o usuário tem uma permissão específica através de seus papéis.
    
    Args:
        codename (str): O codename da permissão (ex: 'ver_cliente', 'criar_documento')
    
    Returns:
        bool: True se o usuário tem a permissão, False caso contrário
    """
    # Verifica se o usuário é superusuário
    if self.user.is_superuser:
        return True
    
    # Busca em todos os papéis do usuário
    return self.papeis.filter(
        permissoes__codename=codename
    ).exists()
```

## 🔧 Como Aplicar a Correção

### 1. **Reiniciar o Servidor Django**

O código já foi atualizado, mas o servidor precisa ser reiniciado para carregar as mudanças.

**No terminal onde o servidor está rodando:**
1. Pressione `Ctrl + C` para parar o servidor
2. Execute novamente:
   ```bash
   python manage.py runserver
   ```

### 2. **Testar a Correção**

Após reiniciar, acesse:
- `http://localhost:3000/documentos` (página de documentos)
- Ou qualquer cliente > aba "Documentos"

O erro deve ter sido corrigido.

## 🧪 Verificação no Shell

Para confirmar que o método está funcionando:

```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from escritorios.models import PerfilUsuario

# Buscar um perfil
perfil = PerfilUsuario.objects.first()

# Testar o método
print(perfil.tem_permissao('ver_documento'))  # True/False
print(perfil.tem_permissao('criar_documento'))  # True/False
```

## 📊 Como Funciona

O método `tem_permissao()`:

1. **Verifica se é superusuário** → retorna `True` imediatamente
2. **Busca em todos os papéis do usuário** → verifica se algum papel tem a permissão
3. **Retorna `True` ou `False`**

### Exemplo de Consulta SQL Gerada:

```sql
SELECT 1 
FROM escritorios_papel 
INNER JOIN escritorios_papel_permissoes ON (escritorios_papel.id = escritorios_papel_permissoes.papel_id)
INNER JOIN escritorios_permissao ON (escritorios_papel_permissoes.permissao_id = escritorios_permissao.id)
WHERE escritorios_permissao.codename = 'ver_documento'
LIMIT 1
```

## 🔍 Por que o Erro Ocorreu?

1. O sistema de permissões foi implementado
2. As classes `DocumentoPermission`, `CategoriaPermission`, `TagPermission` foram criadas
3. Essas classes chamam `request.user.perfil.tem_permissao()`
4. **Mas o método não existia no modelo `PerfilUsuario`**

## ✅ Status Atual

- ✅ Método `tem_permissao()` adicionado ao modelo
- ✅ Testado no shell - funciona corretamente
- ⏳ **Servidor precisa ser reiniciado**

## 🚀 Próximos Passos

Após reiniciar o servidor:

1. Testar login e acesso aos documentos
2. Testar diferentes papéis (Administrador, Assistente, etc.)
3. Verificar se as permissões estão funcionando corretamente
4. Verificar logs de auditoria

## 🔐 Permissões por Papel

| Papel | ver_documento | criar_documento | editar_documento | deletar_documento |
|-------|--------------|----------------|-----------------|-------------------|
| Administrador | ✅ | ✅ | ✅ | ✅ |
| Advogado | ✅ | ✅ | ✅ | ✅ |
| Secretária | ✅ | ✅ | ✅ | ❌ |
| Assistente | ✅ | ❌ | ❌ | ❌ |

---

**Data da Correção:** Outubro 2025  
**Status:** ✅ Implementado (requer restart)
