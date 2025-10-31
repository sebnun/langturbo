FROM node:25-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig.json* ./

RUN npm install --omit=dev 

COPY . .

EXPOSE 3000

CMD ["node", "index.ts"]
