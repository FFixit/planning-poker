FROM node:current-alpine AS build

EXPOSE 8080

WORKDIR /usr/src/app

RUN chown node /usr/src/app
COPY --chown=node:node . .

RUN npm install
RUN npm run build
ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force

USER node

FROM node:current-alpine AS production

WORKDIR /usr/src/app

RUN chown node /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]

USER node