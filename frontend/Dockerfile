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

# Expor porta do React
EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "start"]
