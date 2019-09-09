import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CSRFToken } from './common/decorators/csrf-token.decorator';
import { Request } from 'express';

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
  register(@CSRFToken() csrfToken: string, @Req() req: Request) {
    return { csrfToken, errors: (req as any).flash('errors') };
  }
}
