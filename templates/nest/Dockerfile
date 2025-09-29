FROM node:22-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm pkg delete scripts.prepare
RUN npm ci --only=production && npm cache clean --force

COPY dist .

EXPOSE 3000

CMD ["node","main"]