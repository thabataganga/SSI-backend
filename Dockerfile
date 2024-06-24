# Use a imagem oficial do Node.js como base
FROM node:alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos do diretório local para o diretório de trabalho no contêiner
COPY . .

# Copia o arquivo .env para dentro do contêiner
COPY .env .env

# Instala o PM2 globalmente
RUN npm install -g pm2

# Instala as dependências do projeto
RUN npm install --production

# Expor a porta 8080
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["pm2-runtime", "start", "server.js", "--name=deploy_backend", "--watch"]
