FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
ARG ROOT_DIR=/usr/src/app
ARG APP_DIR=apps/backend/mailer
WORKDIR ${ROOT_DIR}
COPY ./package*.json ./
COPY ./shared/package*.json ./shared/
COPY ./${APP_DIR}/package*.json ./${APP_DIR}/

FROM base AS dependencies
RUN npm ci -w mailer --include-workspace-root

FROM dependencies AS code
COPY ./shared ./shared/
COPY ./${APP_DIR} ./${APP_DIR}/

FROM code AS development
ENV NODE_ENV=development
WORKDIR ${ROOT_DIR}/${APP_DIR}
CMD ["npm", "run", "start:dev"]

FROM code AS builder
RUN npm run build -w shared
RUN npm run build -w mailer
RUN npm ci --omit=dev -w mailer

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
COPY --from=builder --chown=${USER}:${GROUP} ${ROOT_DIR}/shared/dist ./shared/dist
COPY --from=builder --chown=${USER}:${GROUP} ${ROOT_DIR}/${APP_DIR}/dist ./${APP_DIR}/dist
COPY --from=builder --chown=${USER}:${GROUP} ${ROOT_DIR}/${APP_DIR}/templates ./${APP_DIR}/templates
USER ${USER}
WORKDIR ${ROOT_DIR}/${APP_DIR}
ENTRYPOINT ["node", "./dist/src/main.js"]
