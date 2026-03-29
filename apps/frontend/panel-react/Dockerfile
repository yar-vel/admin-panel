FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
ARG ROOT_DIR=/usr/src/app
ARG APP_DIR=apps/frontend/panel-react
WORKDIR ${ROOT_DIR}
COPY ./package*.json ./
COPY ./shared/package*.json ./shared/
COPY ./${APP_DIR}/package*.json ./${APP_DIR}/
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
RUN npm ci -w panel-react --include-workspace-root

FROM dependencies AS code
COPY ./shared ./shared/
COPY ./${APP_DIR} ./${APP_DIR}/

FROM code AS development
ENV NODE_ENV=development
WORKDIR ${ROOT_DIR}/${APP_DIR}
CMD ["npm", "run", "dev"]

FROM code AS builder
ARG PANEL_REACT_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
RUN npm run build -w shared
RUN npm run build -w panel-react
RUN npm ci --omit=dev -w panel-react

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
COPY --from=builder ${ROOT_DIR}/${APP_DIR}/public ./${APP_DIR}/public
COPY --from=builder --chown=${USER}:${GROUP} ${ROOT_DIR}/${APP_DIR}/.next/standalone ./${APP_DIR}
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/${APP_DIR}/.next/static ./${APP_DIR}/.next/static
USER ${USER}
WORKDIR ${ROOT_DIR}/${APP_DIR}
ENTRYPOINT ["node", "server.js"]
