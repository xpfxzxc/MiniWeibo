import {
  Controller,
  Get,
  Render,
  Req,
  Res,
  Post,
  UseGuards,
  UseFilters,
  Request,
  Redirect,
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
  index(
    @User() user: UserEntity,
    @CSRFToken() csrfToken: string,
    @Flash('msg') msg: object,
    @Flash('errors') errors,
    @Flash('old') old,
  ) {
    return { user, csrfToken, msg, errors, old };
  }

  @Get('help')
  @Render('static/help.html')
  help(@User() user: UserEntity, @CSRFToken() csrfToken: string) {
    return { user, csrfToken };
  }

  @Get('about')
  @Render('static/about.html')
  about(@User() user: UserEntity, @CSRFToken() csrfToken: string) {
    return { user, csrfToken };
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
    request.flash('msg', { success: '欢迎，您将在这里开启一段新的旅程~' });
    response.redirect(`users/${id}`);
  }

  @Post('logout')
  @Redirect('/')
  logout(@Request() request) {
    request.logout();
    request.flash('msg', { success: '您已成功退出登录！' });
  }
}
