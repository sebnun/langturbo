FROM node:25-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig.json* ./

RUN npm ci --omit=dev 

COPY . .

ENV NODE_ENV=production

HEALTHCHECK --start-period=10s --retries=3 \
  CMD node up.ts || exit 1

CMD ["node", "index.ts"]
