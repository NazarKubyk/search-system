import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions<RedisOptions> {
    const host = this.configService.get('REDIS_HOST', 'localhost');
    const password = this.configService.getOrThrow('REDIS_PASSWORD');

    return {
      store: redisStore,
      ttl: 86_400_000, //* 24 h
      max: 10,
      host,
      password,
    };
  }
}
