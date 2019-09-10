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
import { LoginGuard } from './common/guards/login.guard';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { User as UserEntity } from './users/user.entity';
import { User } from './common/decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.html')
  index(@User() user: UserEntity) {
    return { user };
  }

  @Get('help')
  @Render('static/help.html')
  help(@User() user: UserEntity) {
    return { user };
  }

  @Get('about')
  @Render('static/about.html')
  about(@User() user: UserEntity) {
    return { user };
  }

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
  login(@Req() request, @Res() response) {
    const id = request.user.id;
    response.redirect(`users/${id}`);
  }
}
