import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('Boostrap');
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || config.get('server.port');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
