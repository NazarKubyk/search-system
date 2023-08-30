import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { CacheConfigService } from './configs/cache.config';
import { SearchQueryHandler } from './search/search.handler';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [SearchQueryHandler],
})
export class AppModule {}
