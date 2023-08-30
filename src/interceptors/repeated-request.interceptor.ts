import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RepeatedRequestInterceptor
  extends CacheInterceptor
  implements NestInterceptor
{
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
    return observable.pipe(tap(() => this.runningQueries.delete(key)));
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
}
