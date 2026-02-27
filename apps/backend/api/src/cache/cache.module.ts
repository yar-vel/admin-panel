import { Module } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createClient, createKeyv, RedisClientType } from '@keyv/redis';
import { Cacheable } from 'cacheable';

import { CacheService } from './cache.service';
import { REDIS } from 'libs/constants';
import { cfg } from 'config/configuration';

@Module({
  providers: [
    // NOTE: The raw Redis connection is necessary because without it we will not have access to the "keys"
    {
      provide: REDIS,
      useFactory: async () => {
        const client = createClient({
          url: `redis://${cfg.redis.user}:${cfg.redis.password}@${cfg.redis.host}:${cfg.redis.port}/${cfg.redis.db}`,
        });
        await client.connect();

        return client;
      },
    },
    {
      provide: CACHE_MANAGER,
      useFactory: (redisClient: RedisClientType) => {
        const secondary = createKeyv(redisClient);

        return new Cacheable({ secondary });
      },
      inject: [REDIS],
    },
    CacheService,
  ],
  exports: [CacheService, REDIS],
})
export class CacheModule {}
