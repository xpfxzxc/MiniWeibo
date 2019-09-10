import {
  Controller,
  Get,
  Render,
  Req,
  Res,
  Post,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CSRFToken } from './common/decorators/csrf-token.decorator';
import { Flash } from './common/decorators/flash.decorator';
import { Request, Response } from 'express';
import { LoginGuard } from './common/guards/login.guard';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

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
  @Render('auth/login.html')
  loginPage(
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

  @UseGuards(LoginGuard)
  @UseFilters(new ValidationExceptionFilter({ includes: ['email'] }))
  @Post('login')
  login(@Req() request: Request, @Res() response: Response) {
    const id = (request as any).user.id;
    response.redirect(`users/${id}`);
  }
}
