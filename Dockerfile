# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

RUN apk add --no-cache git netcat-openbsd

WORKDIR /app

RUN git clone https://github.com/CKhamis/Constantine-EventStar-Website.git .

RUN npm ci

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine AS runner

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=base /app ./

CMD ["sh", "-c", "until nc -z es_db 3306; do echo 'Waiting for DB...'; sleep 3; done && npx prisma migrate deploy && node .next/standalone/server.js"]