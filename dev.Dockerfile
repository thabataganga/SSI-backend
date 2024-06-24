
FROM node:alpine

COPY . .

RUN npm install

RUN npm run dev

EXPOSE 8080