import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';

import { AppModule } from './app.module';
import { version, name } from '../package.json';
import { cfg } from 'config/configuration';
import { getT } from '@ap/shared/dist/locales';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
  );

  await app.register(fastifyCookie);
  await app.register(fastifyHelmet);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(getT().adminPanel)
    .setDescription(getT().adminPanelAPIDescription)
    .setVersion(version)
    .addTag(name)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const hostname = new URL(origin).hostname;
      const allowedHosts = [cfg.urls.nginx];

      if (!cfg.urls.panelReact.startsWith('/')) {
        allowedHosts.push(cfg.urls.panelReact);
      }

      if (!cfg.urls.panelVue.startsWith('/')) {
        allowedHosts.push(cfg.urls.panelVue);
      }

      callback(null, allowedHosts.includes(hostname));
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  await app.listen(cfg.port, cfg.host);
}
bootstrap();
