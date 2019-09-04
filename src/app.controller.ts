import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

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
}
