FROM node:gallium-alpine as base

RUN apk --no-cache add git python3 make gcc musl-dev g++ bash
WORKDIR /app
COPY package*.json ./
RUN npm -v
RUN npm install

FROM node:gallium-alpine as release

COPY --from=base --chown=node:node /app /app
WORKDIR /app
COPY --chown=node:node index.js index.js

USER node
CMD node index.js
