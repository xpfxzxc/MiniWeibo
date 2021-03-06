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
import flash = require('connect-flash');
import passport = require('passport');
import methodOverride = require('method-override');
import nunjucks = require('nunjucks');
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from './global/filters/http-exception.filter';

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

  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 60000,
      max: 50,
      headers: false,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(
    methodOverride(function(req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
      }
    }),
  );

  app.use(
    session({
      secret: configService.get('session.secret'),
      resave: true,
      saveUninitialized: true,
      store: new TypeormStore().connect(appService.sessionRepository),
      cookie: {
        httpOnly: true,
      },
    }),
  );

  app.use(function(req, res, next) {
    const redirect = res.redirect;
    res.redirect = function(...args) {
      req.session.save(() => {
        redirect.apply(res, args);
      });
    };
    next();
  });

  app.use(csurf());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
