import { DEV } from '@ap/shared/dist/libs';
import { readSecret } from '@ap/shared/dist/server';

export const cfg = {
  mode: process.env.NODE_ENV || DEV,
  host: process.env.API_HOST || '0.0.0.0',
  port: Number(process.env.API_PORT || 3001),
  tokens: {
    access: {
      /** Time in seconds */
      lifetime: Number(process.env.API_ACCESS_TOKEN_LIFETIME) || 60 * 60,
      secret: readSecret('/run/secrets/access-token') || 'accessTokenSecretKey',
    },
    refresh: {
      /** Time in seconds */
      lifetime:
        Number(process.env.API_REFRESH_TOKEN_LIFETIME) || 60 * 60 * 24 * 7,
      secret:
        readSecret('/run/secrets/refresh-token') || 'refreshTokenSecretKey',
    },
  },
  urls: {
    nginx: process.env.NGINX_HOST || 'localhost',
    api: process.env.API_URL || '/api/',
    panelReact: process.env.PANEL_REACT_URL || '/',
    panelVue: process.env.PANEL_VUE_URL || '/vue/',
  },
  rmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    user: process.env.RABBITMQ_DEFAULT_USER || 'user',
    password: process.env.RABBITMQ_DEFAULT_PASS || 'password',
    mailQueue: process.env.RABBITMQ_MAIL_QUEUE || 'mailQueue',
    cmd: {
      registration: process.env.MAILER_CMD_REGISTRATION || 'registration',
      forgotPassword:
        process.env.MAILER_CMD_FORGOT_PASSWORD || 'forgotPassword',
      changeEmail: process.env.MAILER_CMD_CHANGE_EMAIL || 'changeEmail',
    },
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    db: process.env.POSTGRES_DB || 'main',
    synchronize: process.env.NODE_ENV === DEV,
    logging: process.env.NODE_ENV === DEV,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    user: process.env.REDIS_USER || 'user',
    password: process.env.REDIS_PASSWORD || 'password',
    db: Number(process.env.REDIS_DB) || 0,
  },
};
