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
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CSRFToken } from './common/decorators/csrf-token.decorator';
import { Flash } from './common/decorators/flash.decorator';
import { LoginGuard } from './common/guards/login.guard';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { User as UserEntity } from './users/user.entity';
import { User } from './common/decorators/user.decorator';
import { UsersService } from './users/users.service';
import { StatusesService } from './statuses/statuses.service';
import { PaginationQueryExceptionFilter } from './common/filters/pagination-query-exception.filter';
import { PaginationQueryException } from './common/exceptions/pagination-query.exception';
import { IndexDto } from './dto/index.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly statusesService: StatusesService,
  ) {}

  @UseFilters(PaginationQueryExceptionFilter)
  @Get()
  @Render('index.html')
  async index(
    @User() user: UserEntity,
    @Query(
      new ValidationPipe({
        transform: true,
        exceptionFactory: errors => new PaginationQueryException(),
      }),
    )
    indexDto: IndexDto,
    @CSRFToken() csrfToken: string,
    @Flash('msg') msg: object,
    @Flash('errors') errors,
    @Flash('old') old,
    @Request() request,
  ) {
    if (!request.isAuthenticated()) {
      return { user, csrfToken, msg };
    }

    const { page = 1, limit = 10 } = indexDto;
    const {
      items: feedItems,
      itemCount: feedCount,
      totalItems: totalFeeds,
      pageCount: totalPages,
    } = await this.usersService.feed(user.id, { page, limit });

    if (page !== 1 && feedCount === 0) {
      throw new PaginationQueryException();
    }

    return {
      user,
      csrfToken,
      msg,
      errors,
      old,
      feedItems,
      totalFeeds,
      totalPages,
      page: page,
      limit: limit,
      totalFollowings: await this.usersService.countAllFollowingsById(user.id),
      totalFollowers: await this.usersService.countAllFollowersById(user.id),
      totalStatuses: await this.statusesService.countAllForUser(user.id),
    };
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
    request.flash('msg', { success: '欢迎，您将在这里开启一段新的旅程~' });
    response.redirect(`/`);
  }

  @Post('logout')
  @Redirect('/')
  logout(@Request() request) {
    request.logout();
    request.flash('msg', { success: '您已成功退出登录！' });
  }
}
