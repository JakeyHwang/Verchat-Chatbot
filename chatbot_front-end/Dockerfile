FROM node:18-alpine AS deps
RUN mkdir -p /app
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY src .
COPY build .

RUN  npm install --production

FROM node:18-alpine AS builder

ENV NODE_ENV production
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ARG X_TAG
ENV NODE_ENV=production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]