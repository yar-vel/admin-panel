import { Inject, Injectable, Logger } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

import { MAIL_SERVER } from 'libs/constants';
import { getField, IQueuePattern } from '@workspace/shared';

@Injectable()
export class QueueHealthService {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @Inject(MAIL_SERVER)
    private client: ClientProxy,
  ) {}

  async isHealthy(key: string = 'queue') {
    const indicator = this.healthIndicatorService.check(key);

    try {
      const response = await lastValueFrom<unknown>(
        this.client
          .send<IQueuePattern>({ cmd: 'ping_pattern' }, { ping: true })
          .pipe(timeout(5000)),
      );

      if (getField<boolean>(response, 'pong')) {
        return indicator.up();
      } else {
        throw new Error();
      }
    } catch (error) {
      Logger.error(error);
      return indicator.down(String(error));
    }
  }
}
