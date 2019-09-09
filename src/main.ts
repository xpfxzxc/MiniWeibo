import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { useContainer } from 'class-validator';
const nunjucks = require('nunjucks');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  nunjucks.configure('views', {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    watch: true,
    express: app,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
