#!/bin/bash
set -e

echo "🚀 Iniciando backend Django..."

# Aguardar o banco de dados estar pronto (opcional, útil se usar PostgreSQL local)
echo "⏳ Aguardando banco de dados..."
sleep 2

# Executar migrações
echo "📦 Aplicando migrações..."
python manage.py migrate --noinput

# Coletar arquivos estáticos
echo "📁 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput --clear || true

# Criar superusuário se não existir (opcional)
# echo "👤 Criando superusuário..."
# python manage.py createsuperuser --noinput || true

echo "✅ Backend pronto!"

# Executar comando passado como argumento
exec "$@"
