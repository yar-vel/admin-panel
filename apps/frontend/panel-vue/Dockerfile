FROM oven/bun:1-alpine AS base
ENV NUXT_TELEMETRY_DISABLED=1
ARG APP_DIR=/usr/src/app
ARG HOST_DIR=/apps/frontend/panel-vue
ARG HOME_DIR=${APP_DIR}${HOST_DIR}
WORKDIR ${HOME_DIR}
COPY ${HOST_DIR}/package*.json .
COPY ./shared ${APP_DIR}/shared

FROM base AS development
ENV NODE_ENV=development
RUN bun install
CMD ["bun", "--bun", "run", "dev"]

FROM base AS builder
ARG PANEL_VUE_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
RUN bun install
COPY ${HOST_DIR} .
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=bun
ARG GROUP=bun
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/.output ./.output
USER ${USER}
ENTRYPOINT ["bun", ".output/server/index.mjs"]
