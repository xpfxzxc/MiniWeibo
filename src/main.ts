import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { useContainer } from 'class-validator';
import * as session from 'express-session';
import { AppService } from './app.service';
import { TypeormStore } from 'connect-typeorm';
import * as csurf from 'csurf';
import bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appService = app.get(AppService);
  const configService = appService.configService;

  nunjucks.configure('views', {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    watch: true,
    express: app,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(
    session({
      secret: configService.get('session.secret'),
      resave: true,
      saveUninitialized: true,
      store: new TypeormStore().connect(appService.sessionRepository),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 4,
      },
    }),
  );

  app.use(csurf());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
