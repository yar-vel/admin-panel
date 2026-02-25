import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

import { AppModule } from 'src/app.module';
import { MAIL_SERVER, REDIS } from 'libs/constants';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { cfg } from 'config/configuration';

let pgContainer: StartedPostgreSqlContainer;
export let app: NestFastifyApplication;
export const queue: Record<string, string>[] = [];
export const wrongValue = '!!!';
export const wrongId = '00000000-0000-0000-0000-000000000000';
export const admin: SignUpDto = {
  name: 'Tester 1',
  email: 'test1@mail.com',
  password: '!Q1q2w3e4r',
};
export const user: SignUpDto = {
  name: 'Tester 2',
  email: 'test2@mail.com',
  password: 'r4e3w2q1Q!',
};
export const adminCookies: string[] = [];
export const userCookies: string[] = [];
export const timeout = 60000;

export const createApp = async () => {
  pgContainer = await new PostgreSqlContainer('postgres:alpine')
    .withStartupTimeout(timeout)
    .start();
  cfg.postgres.host = pgContainer.getHost();
  cfg.postgres.port = pgContainer.getPort();
  cfg.postgres.user = pgContainer.getUsername();
  cfg.postgres.password = pgContainer.getPassword();
  cfg.postgres.db = pgContainer.getDatabase();
  cfg.postgres.synchronize = true;

  const cache: Record<string, unknown> = {};
  const mockRedis = {
    keys: jest.fn((pattern: string) =>
      Object.keys(cache).filter((key) =>
        key.includes(pattern.substring(0, pattern.length - 1)),
      ),
    ),
    get: jest.fn((key: string): unknown => cache[key]),
    getMany: jest.fn((keys: string[]): unknown[] =>
      Object.keys(cache)
        .filter((key) => keys.includes(key))
        .map((key) => cache[key]),
    ),
    set: jest.fn((key: string, value: unknown) => {
      cache[key] = value;
      return true;
    }),
    delete: jest.fn((key: string) => {
      delete cache[key];
      return true;
    }),
    deleteMany: jest.fn((keys: string[]) => {
      for (const key of keys) {
        delete cache[key];
      }
      return true;
    }),
    quit: jest.fn().mockResolvedValue(true),
  };

  const mockClientProxy = {
    send: jest.fn((_, data: Record<string, string>) => {
      queue.push(data);
      return of();
    }),
    emit: jest.fn(() => of(true)),
    connect: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
  };

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(REDIS)
    .useValue(mockRedis)
    .overrideProvider(CACHE_MANAGER)
    .useValue(mockRedis)
    .overrideProvider(MAIL_SERVER)
    .useValue(mockClientProxy)
    .compile();

  app = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie);
  await app.register(fastifyHelmet);

  app.enableCors({
    origin: [`https://${cfg.urls.nginx}`],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
};

export const closeApp = async () => {
  if (!app) {
    console.warn('App does not exist');
    return;
  }

  await app.close();

  if (pgContainer) {
    await pgContainer.stop();
  }
};
