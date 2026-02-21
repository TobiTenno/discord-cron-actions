FROM node:gallium-alpine AS base

RUN apk --no-cache add git python3 make gcc musl-dev g++ bash
WORKDIR /app
COPY package*.json ./
RUN npm -v
RUN npm install

FROM node:gallium-alpine AS release
LABEL org.opencontainers.image.source = "https://github.com/TobiTenno/discord-cron-actions"

COPY --from=base --chown=node:node /app /app
# ensure the config dir is created
WORKDIR /app/config
WORKDIR /app
COPY --chown=node:node index.js index.js


USER node
CMD node index.js
