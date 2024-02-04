FROM node:18-alpine AS base
WORKDIR /chatbot_front-end
COPY package.json .
EXPOSE 3000

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]
# ENV NODE_ENV production
# RUN mkdir -p /chatbot_front-end
# RUN mkdir -p /chatbot_front-end/.next
# WORKDIR /chatbot_front-end
# RUN apk add --no-cache libc6-compat
# COPY package.json .
# COPY --chown=node:node . .
# EXPOSE 3000
# ENV PATH /chatbot_front-end/node_modules/.bin:$PATH
# RUN npm ci --only=production
# USER node

# FROM node:18-alpine AS builder


# WORKDIR /chatbot_front-end
# COPY . .
# COPY --from=deps /chatbot_front-end/node_modules ./node_modules

# ENV NEXT_TELEMETRY_DISABLED 1

# RUN npm run build

# FROM node:18-alpine AS runner

# WORKDIR /chatbot_front-end

# ARG X_TAG
# ENV NODE_ENV=production
# COPY --from=builder /chatbot_front-end/next.config.js ./
# COPY --from=builder /chatbot_front-end/.next ./.next
# COPY --from=builder /chatbot_front-end/node_modules ./node_modules
# CMD ["node_modules/.bin/next", "start"]

