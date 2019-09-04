import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const nunjucks = require('nunjucks');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  nunjucks.configure('views', {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    watch: true,
    express: app,
  });

  await app.listen(3000);
}
bootstrap();
