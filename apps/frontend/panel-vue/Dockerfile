FROM oven/bun:1-alpine AS base
ARG ROOT_DIR=/usr/src/app
ARG APP_DIR=apps/frontend/panel-vue
WORKDIR ${ROOT_DIR}
COPY ./package*.json ./
COPY ./shared/package*.json ./shared/
COPY ./${APP_DIR}/package*.json ./${APP_DIR}/
ENV NUXT_TELEMETRY_DISABLED=1
# NOTE: bun workspaces fix
COPY ./apps/frontend/panel-react/package*.json ./apps/frontend/panel-react/
COPY ./apps/backend/api/package*.json ./apps/backend/api/
COPY ./apps/backend/mailer/package*.json ./apps/backend/mailer/
COPY ./scripts/package*.json ./scripts/

FROM base AS dependencies
# NOTE: use the "--frozen-lockfile" flag if you have the "bun.lock" file
RUN bun install --filter @workspace/shared --filter panel-vue

FROM dependencies AS code
COPY ./shared ./shared/
COPY ./${APP_DIR} ./${APP_DIR}/

FROM code AS development
ENV NODE_ENV=development
WORKDIR ${ROOT_DIR}/${APP_DIR}
CMD ["bun", "--bun", "run", "dev"]

FROM code AS builder
ARG PANEL_VUE_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
WORKDIR ${ROOT_DIR}/shared
RUN bun run build
WORKDIR ${ROOT_DIR}/${APP_DIR}
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=bun
ARG GROUP=bun
COPY --from=builder --chown=${USER}:${GROUP} ${ROOT_DIR}/${APP_DIR}/.output ./${APP_DIR}/.output
USER ${USER}
WORKDIR ${ROOT_DIR}/${APP_DIR}
ENTRYPOINT ["bun", ".output/server/index.mjs"]
