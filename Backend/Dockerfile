FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 7001

CMD ["npm", "start"]
