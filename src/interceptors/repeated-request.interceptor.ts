import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RepeatedRequestInterceptor
  extends CacheInterceptor
  implements NestInterceptor
{
  private readonly max = 10;
  private readonly runningQueries = new Set();

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);

    if (this.runningQueries.has(key)) {
      await this.waitForQuery(key);
      return this.cacheManager.get(key);
    }

    this.runningQueries.add(key);
    const observable = await super.intercept(context, next);
    return observable.pipe(
      tap(async () => {
        await this.checkCountOfItemsInCache(context);
        this.runningQueries.delete(key);
      }),
    );
  }

  private waitForQuery(query: string): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.runningQueries.has(query)) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  private async checkCountOfItemsInCache(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const redis = this.cacheManager.store.client as Redis;
    const key = this.trackBy(context);

    await redis.lrem(request.path, 0, key);
    await redis.lpush(request.path, key);

    const elementCount = await redis.llen(request.path);
    const firstElement = await redis.lindex(request.path, -1);

    if (elementCount > this.max) {
      await redis.lrem(request.path, 0, firstElement);
      await this.cacheManager.del(firstElement);
    }
  }
}
