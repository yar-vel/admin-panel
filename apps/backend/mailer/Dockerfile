FROM node:24-alpine AS base
ARG APP_DIR=/usr/src/app
ARG HOST_DIR=/apps/backend/mailer
ARG HOME_DIR=${APP_DIR}${HOST_DIR}
WORKDIR ${HOME_DIR}
COPY ${HOST_DIR}/package*.json .
COPY ./shared ${APP_DIR}/shared

FROM base AS development
ENV NODE_ENV=development
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN npm ci
COPY ${HOST_DIR} .
RUN npm run build
RUN npm prune --production

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/node_modules ./node_modules
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/dist ./dist
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/templates ./templates
USER ${USER}
ENTRYPOINT ["node", "./dist/src/main.js"]
