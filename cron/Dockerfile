FROM node:25-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig.json* ./

RUN npm ci --omit=dev 

COPY . .

CMD ["node", "index.ts"]
