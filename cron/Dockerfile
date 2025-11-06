FROM node:25-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig.json* ./

RUN npm ci --omit=dev 

COPY . .

ENV NODE_ENV=production

RUN apk add --no-cache procps
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 CMD pgrep -f "node index.ts" > /dev/null || exit 1

CMD ["node", "index.ts"]
