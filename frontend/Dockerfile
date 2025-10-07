# Frontend Dockerfile para React
FROM node:20-alpine

# Metadados
LABEL maintainer="Sistema de Advocacia"
LABEL description="Frontend React para Sistema de Advocacia"

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor porta do React (mudada para 3001 para evitar conflito com Easypanel)
EXPOSE 3001

# Definir porta customizada
ENV PORT=3001

# Desabilitar verificação de host (necessário para deployment)
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

# Permitir qualquer host do webpack dev server
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "start"]
