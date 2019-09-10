import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CSRFToken } from './common/decorators/csrf-token.decorator';
import { Flash } from './common/decorators/flash.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.html')
  index() {}

  @Get('help')
  @Render('static/help.html')
  help() {}

  @Get('about')
  @Render('static/about.html')
  about() {}

  @Get('register')
  @Render('users/create.html')
  register(
    @CSRFToken() csrfToken: string,
    @Flash('errors') errors,
    @Flash('old') old,
  ) {
    return {
      csrfToken,
      errors,
      old,
    };
  }

  @Get('login')
  @Render('session/login.html')
  login() {}
}
