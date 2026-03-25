FROM node:24-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
ARG APP_DIR=/usr/src/app
ARG HOST_DIR=/apps/frontend/panel-react
ARG HOME_DIR=${APP_DIR}${HOST_DIR}
WORKDIR ${HOME_DIR}
COPY ${HOST_DIR}/package*.json .
COPY ./shared ${APP_DIR}/shared

FROM base AS development
ENV NODE_ENV=development
RUN npm install
CMD ["npx", "next", "dev"]

FROM base AS builder
ARG PANEL_REACT_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
RUN apk add --no-cache libc6-compat
RUN npm ci
COPY ${HOST_DIR} .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
WORKDIR ${APP_DIR}
COPY --from=builder ${HOME_DIR}/public ${HOME_DIR}/public
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/.next/standalone ./
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/.next/static ${HOME_DIR}/.next/static
WORKDIR ${HOME_DIR}
USER ${USER}
ENTRYPOINT ["node", "server.js"]
