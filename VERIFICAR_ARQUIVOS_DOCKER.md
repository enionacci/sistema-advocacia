# 🔍 Comandos para Verificar Localização de Arquivos no Docker (VPS)

## 📋 Comandos Essenciais

### 1️⃣ Ver informações do Volume Docker

```bash
# Ver todos os volumes
docker volume ls

# Inspecionar o volume de media (mostra path físico)
docker volume inspect sistema-advocacia_backend-media

# OU se for volume sem prefixo:
docker volume inspect backend-media
```

**Saída esperada:**
```json
[
    {
        "CreatedAt": "2025-10-07T12:34:56Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "sistema-advocacia",
            "com.docker.compose.volume": "backend-media"
        },
        "Mountpoint": "/var/lib/docker/volumes/sistema-advocacia_backend-media/_data",
        "Name": "sistema-advocacia_backend-media",
        "Options": null,
        "Scope": "local"
    }
]
```

O campo **"Mountpoint"** mostra onde está fisicamente na VPS!

---

### 2️⃣ Ver Volumes Montados no Container

```bash
# Ver detalhes do container
docker inspect advocacia-backend

# Ver apenas os volumes montados (mais limpo)
docker inspect advocacia-backend | grep -A 10 "Mounts"

# OU no formato JSON filtrado:
docker inspect advocacia-backend --format='{{json .Mounts}}' | jq
```

---

### 3️⃣ Listar Arquivos DENTRO do Container

```bash
# Entrar no container
docker exec -it advocacia-backend bash

# Listar arquivos media
ls -la /app/media/
ls -la /app/media/documentos/

# Ver estrutura completa
tree /app/media/  # se tree estiver instalado

# OU usar find
find /app/media/ -type f

# Contar quantos arquivos
find /app/media/ -type f | wc -l

# Ver tamanho total
du -sh /app/media/

# Ver por tipo de arquivo
find /app/media/ -name "*.pdf" | wc -l
find /app/media/ -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | wc -l

# Sair do container
exit
```

---

### 4️⃣ Listar Arquivos FORA do Container (Host VPS)

```bash
# Ir para o diretório físico do volume
# (usar o Mountpoint que você encontrou no comando 1)
cd /var/lib/docker/volumes/sistema-advocacia_backend-media/_data

# Listar
ls -la
ls -la documentos/

# Ver estrutura
tree .

# Contar arquivos
find . -type f | wc -l

# Ver tamanho
du -sh .
du -h --max-depth=2 .
```

---

### 5️⃣ Comparar: Container vs Host

```bash
# Script completo de verificação
echo "=== DENTRO DO CONTAINER ==="
docker exec advocacia-backend find /app/media/ -type f | wc -l
docker exec advocacia-backend du -sh /app/media/

echo ""
echo "=== FORA DO CONTAINER (HOST) ==="
sudo find /var/lib/docker/volumes/sistema-advocacia_backend-media/_data -type f | wc -l
sudo du -sh /var/lib/docker/volumes/sistema-advocacia_backend-media/_data
```

---

### 6️⃣ Verificar Path de um Arquivo Específico

```bash
# Dentro do container - Python shell
docker exec -it advocacia-backend python manage.py shell
```

```python
from documentos.models import Documento
import os

# Pegar um documento
doc = Documento.objects.first()

if doc and doc.arquivo:
    print(f"Nome do arquivo: {doc.arquivo.name}")
    print(f"Path no Django: {doc.arquivo.path}")
    print(f"URL: {doc.arquivo.url}")
    print(f"Existe? {os.path.exists(doc.arquivo.path)}")
    print(f"Tamanho: {os.path.getsize(doc.arquivo.path) if os.path.exists(doc.arquivo.path) else 'N/A'}")
else:
    print("Nenhum documento encontrado")

# Listar todos os documentos
print("\n=== TODOS OS DOCUMENTOS ===")
for d in Documento.objects.all()[:10]:
    exists = os.path.exists(d.arquivo.path) if d.arquivo else False
    print(f"ID: {d.id} | {d.nome_original} | Existe: {exists}")
```

---

### 7️⃣ Ver Logs de Upload em Tempo Real

```bash
# Ver logs do backend
docker logs -f advocacia-backend

# Filtrar apenas logs de upload
docker logs advocacia-backend 2>&1 | grep -i "upload\|documento\|media"
```

---

### 8️⃣ Verificar Permissões

```bash
# Verificar permissões do volume (fora do container)
sudo ls -la /var/lib/docker/volumes/sistema-advocacia_backend-media/_data

# Verificar permissões (dentro do container)
docker exec advocacia-backend ls -la /app/media/

# Ver dono dos arquivos
docker exec advocacia-backend stat /app/media/documentos/

# Verificar se o usuário do container pode escrever
docker exec advocacia-backend touch /app/media/test-write.txt
docker exec advocacia-backend ls -la /app/media/test-write.txt
docker exec advocacia-backend rm /app/media/test-write.txt
```

---

### 9️⃣ Monitorar Uploads em Tempo Real

```bash
# Terminal 1: Watch nos arquivos
watch -n 1 'sudo find /var/lib/docker/volumes/sistema-advocacia_backend-media/_data -type f | wc -l'

# Terminal 2: Logs do container
docker logs -f advocacia-backend

# Agora faça upload de um arquivo pelo frontend e veja aparecer!
```

---

### 🔟 Script Completo de Diagnóstico

```bash
#!/bin/bash
# diagnostico-media.sh

echo "🔍 DIAGNÓSTICO DE ARQUIVOS MEDIA - DOCKER"
echo "=========================================="
echo ""

echo "📦 1. Informações do Volume"
echo "----------------------------"
docker volume inspect sistema-advocacia_backend-media | grep -E "Name|Mountpoint" || \
docker volume inspect backend-media | grep -E "Name|Mountpoint"
echo ""

echo "📊 2. Arquivos no Container"
echo "----------------------------"
echo -n "Quantidade: "
docker exec advocacia-backend find /app/media/ -type f 2>/dev/null | wc -l
echo -n "Tamanho total: "
docker exec advocacia-backend du -sh /app/media/ 2>/dev/null | awk '{print $1}'
echo ""

echo "📁 3. Estrutura de Diretórios"
echo "----------------------------"
docker exec advocacia-backend ls -la /app/media/ 2>/dev/null
echo ""

echo "🗂️  4. Documentos no Banco"
echo "----------------------------"
docker exec advocacia-backend python manage.py shell -c "
from documentos.models import Documento
import os
total = Documento.objects.count()
ativos = Documento.objects.filter(ativo=True).count()
print(f'Total de documentos: {total}')
print(f'Documentos ativos: {ativos}')
print(f'Documentos inativos: {total - ativos}')
print('')
print('Verificando existência dos arquivos...')
existentes = 0
faltando = 0
for doc in Documento.objects.filter(ativo=True):
    if doc.arquivo and os.path.exists(doc.arquivo.path):
        existentes += 1
    else:
        faltando += 1
print(f'Arquivos existentes: {existentes}')
print(f'Arquivos faltando: {faltando}')
" 2>/dev/null
echo ""

echo "✅ Diagnóstico concluído!"
```

**Salvar e executar:**
```bash
# Na VPS
nano diagnostico-media.sh
# Cole o script acima
chmod +x diagnostico-media.sh
./diagnostico-media.sh
```

---

## 🎯 Comando Rápido (Copie e Cole)

```bash
# Ver tudo de uma vez
echo "=== VOLUMES ===" && \
docker volume ls && \
echo "" && \
echo "=== VOLUME MEDIA ===" && \
docker volume inspect sistema-advocacia_backend-media 2>/dev/null | grep Mountpoint || \
docker volume inspect backend-media 2>/dev/null | grep Mountpoint && \
echo "" && \
echo "=== ARQUIVOS NO CONTAINER ===" && \
docker exec advocacia-backend find /app/media/documentos -type f 2>/dev/null | head -10 && \
echo "" && \
echo "=== CONTAGEM ===" && \
echo -n "Total de arquivos: " && \
docker exec advocacia-backend find /app/media -type f 2>/dev/null | wc -l && \
echo -n "Tamanho: " && \
docker exec advocacia-backend du -sh /app/media 2>/dev/null
```

---

## 📝 Interpretando os Resultados

### ✅ Tudo OK se você ver:

```
Mountpoint: /var/lib/docker/volumes/sistema-advocacia_backend-media/_data
Total de arquivos: 15
Tamanho: 45M
Arquivos existentes: 15
Arquivos faltando: 0
```

### ⚠️ Problema se você ver:

```
Total de arquivos: 0
Tamanho: 4.0K
Arquivos existentes: 0
Arquivos faltando: 15
```

Isso significa que o banco tem registros mas os arquivos não existem!

---

## 🔧 Troubleshooting

### Se não encontrar o volume:

```bash
# Listar TODOS os volumes
docker volume ls

# Verificar nome do projeto no docker-compose
cd ~/sistema-advocacia
grep "name:" docker-compose.prod.yml
```

### Se o container não existir:

```bash
# Ver containers
docker ps -a

# Iniciar se estiver parado
docker start advocacia-backend

# Verificar nome correto
docker ps --format "{{.Names}}"
```

### Se não tiver permissão:

```bash
# Usar sudo
sudo docker exec advocacia-backend ls /app/media/
sudo ls -la /var/lib/docker/volumes/
```

---

**Data:** 07/10/2025  
**Útil para:** Debugging, verificação de arquivos, troubleshooting
