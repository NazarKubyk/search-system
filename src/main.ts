import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('API');

  const configService = app.get(ConfigService);

  const port = configService.get('PORT', 3000);
  const prefix = configService.get('API_PREFIX', 'api');

  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(port, () => {
    logger.log(`Listening on port: ${port}`);
  });
})();
