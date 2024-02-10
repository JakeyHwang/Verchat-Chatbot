FROM node:18-alpine AS base
WORKDIR /chatbot_front-end
COPY package.json .
EXPOSE 3000

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]