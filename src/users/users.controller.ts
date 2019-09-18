import {
  Controller,
  Post,
  Res,
  Body,
  UseFilters,
  Get,
  UseGuards,
  Render,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { StoreUserDto } from './dto/store-user.dto';
import { UsersService } from './users.service';
import { ValidationFeedbackPipe } from '../common/pipes/validation-feedback.pipe';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';
import { User as UserEntity } from './user.entity';
import { User } from '../common/decorators/user.decorator';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { CSRFToken } from '../common/decorators/csrf-token.decorator';
import { Flash } from '../common/decorators/flash.decorator';
import { Request } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAdminGuard } from '../common/guards/is-admin.guard';
import { NotActionToSelfGuard } from '../common/guards/not-action-to-self.guard';
import { ActionToSelfGuard } from '../common/guards/action-to-self.guard';
import { StatusesService } from '../statuses/statuses.service';
import { IndexUserDto } from './dto/index-user.dto';
import { PaginationQueryExceptionFilter } from '../common/filters/pagination-query-exception.filter';
import { PaginationQueryException } from '../common/exceptions/pagination-query.exception';
import { ShowUserDto } from './dto/show-user.dto';
import { ShowFollowerDto } from './dto/show-follower.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly statusesService: StatusesService,
  ) {}

  @Post()
  @UseFilters(
    new ValidationExceptionFilter({
      includes: ['name', 'email'],
    }),
  )
  async store(
    @Body(ValidationFeedbackPipe) storeUserDto: StoreUserDto,
    @Request() request,
    @Res() response,
  ) {
    const user = await this.usersService.store(storeUserDto);
    request.login(user, err => {
      if (err) {
        console.log(err);
      } else {
        request.flash('msg', { success: '欢迎，您将在这里开启一段新的旅程~' });
        response.redirect(`/users/${user.id}`);
      }
    });
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(PaginationQueryExceptionFilter)
  @Get(':id')
  @Render('users/show.html')
  async show(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @CSRFToken() csrfToken: string,
    @Query(
      new ValidationPipe({
        transform: true,
        exceptionFactory: errors => new PaginationQueryException(),
      }),
    )
    showUserDto: ShowUserDto,
    @Flash('msg') msg: object,
  ) {
    const { page = 1, limit = 5 } = showUserDto;
    const {
      items: statuses,
      itemCount: statusCount,
      totalItems: totalStatuses,
      pageCount: totalPages,
    } = await this.statusesService.paginateForUser(id, { page, limit });

    if (page !== 1 && statusCount === 0) {
      throw new PaginationQueryException();
    }

    return {
      user,
      msg,
      csrfToken,
      u: await this.usersService.findOneById(id),
      statuses,
      totalStatuses,
      totalPages,
      page,
      limit,
      totalFollowings: await this.usersService.countAllFollowingsById(id),
      totalFollowers: await this.usersService.countAllFollowersById(id),
    };
  }

  @UseGuards(AuthenticatedGuard, ActionToSelfGuard)
  @Get(':id/edit')
  @Render('users/edit.html')
  edit(
    @User() user: UserEntity,
    @CSRFToken() csrfToken: string,
    @Flash('errors') errors: string[],
    @Flash('msg') msg: object,
  ) {
    return { user, csrfToken, errors, msg };
  }

  @UseGuards(AuthenticatedGuard, ActionToSelfGuard)
  @UseFilters(new ValidationExceptionFilter({ includes: [] }))
  @Patch(':id')
  async update(
    @Body(ValidationFeedbackPipe) updateUserDto: UpdateUserDto,
    @Request() request,
    @Res() response,
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.usersService.update(user, updateUserDto);
    request.flash('msg', { success: '个人资料更新成功！' });
    response.redirect(`/users/${user.id}/edit`);
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(PaginationQueryExceptionFilter)
  @Get()
  @Render('users/index.html')
  async index(
    @User() user: UserEntity,
    @Query(
      new ValidationPipe({
        transform: true,
        exceptionFactory: errors => new PaginationQueryException(),
      }),
    )
    indexUserDto: IndexUserDto,
    @CSRFToken() csrfToken: string,
    @Flash('msg') msg: object,
  ) {
    const { page = 1, limit = 10 } = indexUserDto;
    const {
      items: users,
      itemCount: userCount,
      totalItems: totalUsers,
      pageCount: totalPages,
    } = await this.usersService.paginate({ page, limit });

    if (page !== 1 && userCount === 0) {
      throw new PaginationQueryException();
    }

    return {
      user,
      msg,
      csrfToken,
      users,
      totalUsers,
      totalPages,
      page,
      limit,
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, IsAdminGuard, NotActionToSelfGuard)
  async destroy(
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
    @Res() response,
  ) {
    if (await this.usersService.destroy(id)) {
      request.flash('msg', { success: '成功删除用户' });
    }
    response.redirect('back');
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(PaginationQueryExceptionFilter)
  @Get(':id/followings')
  @Render('users/show-follow.html')
  async followings(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Query(
      new ValidationPipe({
        transform: true,
        exceptionFactory: errors => new PaginationQueryException(),
      }),
    )
    showFollowerDto: ShowFollowerDto,
    @CSRFToken() csrfToken: string,
  ) {
    const { page = 1, limit = 10 } = showFollowerDto;
    const {
      items: users,
      itemCount: userCount,
      totalItems: totalUsers,
      pageCount: totalPages,
    } = await this.usersService.paginateFollowings(id, { page, limit });

    if (page !== 1 && userCount === 0) {
      throw new PaginationQueryException();
    }

    const u = await this.usersService.findOneById(id);

    return {
      user,
      csrfToken,
      title: `${u.name}关注的人`,
      u,
      users,
      totalUsers,
      totalPages,
      page,
      limit,
      urlPostfix: 'followings',
    };
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(PaginationQueryExceptionFilter)
  @Get(':id/followers')
  @Render('users/show-follow.html')
  async followers(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Query(
      new ValidationPipe({
        transform: true,
        exceptionFactory: errors => new PaginationQueryException(),
      }),
    )
    showFollowerDto: ShowFollowerDto,
    @CSRFToken() csrfToken: string,
  ) {
    const { page = 1, limit = 10 } = showFollowerDto;
    const {
      items: users,
      itemCount: userCount,
      totalItems: totalUsers,
      pageCount: totalPages,
    } = await this.usersService.paginateFollowers(id, { page, limit });

    if (page !== 1 && userCount === 0) {
      throw new PaginationQueryException();
    }

    const u = await this.usersService.findOneById(id);

    return {
      user,
      csrfToken,
      title: `${u.name}的粉丝`,
      u,
      users,
      totalUsers,
      totalPages,
      page,
      limit,
      urlPostfix: 'followers',
    };
  }
}
