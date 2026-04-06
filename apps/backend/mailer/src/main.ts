import './tracing';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { MicroserviceModule } from './microservice.module';
import { cfg } from 'config/configuration';

async function bootstrap() {
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      MicroserviceModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${cfg.rmq.user}:${cfg.rmq.password}@${cfg.rmq.host}:${cfg.rmq.port}`,
          ],
          queue: cfg.rmq.mailQueue,
          queueOptions: {
            durable: false,
          },
        },
      },
    );

  microservice.enableShutdownHooks();

  await microservice.listen();
}
bootstrap();
