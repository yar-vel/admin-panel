import { DEV, TEST } from '@ap/shared/dist/libs';
import { readSecret } from '@ap/shared/dist/server';

export const cfg = {
  mode: process.env.NODE_ENV || DEV,
  host: process.env.MAILER_HOST ? '0.0.0.0' : 'localhost',
  port: Number(process.env.MAILER_PORT || 3000),
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
  smtp: {
    test: true, // 'true' in test project, 'MODE === DEV' in real project
    host: process.env.MAILER_SMTP_HOST || 'localhost',
    port: Number(process.env.MAILER_SMTP_PORT) || 587,
    user: process.env.MAILER_SMTP_USER || 'user',
    password:
      process.env.NODE_ENV === TEST
        ? 'password'
        : readSecret('/run/secrets/smtp'),
    from: `"No Reply" <no-reply@${process.env.PROJECT_TAG}>`,
  },
};
