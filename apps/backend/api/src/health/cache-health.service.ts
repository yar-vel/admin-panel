import { Inject, Injectable, Logger } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { RedisClientType } from '@keyv/redis';

import { REDIS } from 'libs/constants';

@Injectable()
export class CacheHealthService {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @Inject(REDIS)
    private readonly client: RedisClientType,
  ) {}

  async isHealthy(key: string = 'cache') {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.client.ping();
      return indicator.up();
    } catch (error) {
      Logger.error(error);
      return indicator.down(String(error));
    }
  }
}
