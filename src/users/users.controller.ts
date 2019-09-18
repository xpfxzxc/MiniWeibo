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
  @Get(':id')
  @Render('users/show.html')
  async show(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @CSRFToken() csrfToken: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Flash('msg') msg: object,
    @Res() response,
  ) {
    if (
      !Number.isInteger(+page) ||
      !Number.isInteger(+limit) ||
      +page <= 0 ||
      +limit > 100
    ) {
      response.redirect(`/users/${id}`);
      return;
    }

    const totalStatuses = await this.statusesService.countAllForUser(id);
    const totalPages = Math.ceil(totalStatuses / +limit);
    if (+page > totalPages) {
      response.redirect(`/users/${id}`);
      return;
    }

    const statuses = await this.statusesService.paginateForUser(
      id,
      +page,
      +limit,
    );
    return {
      user,
      msg,
      csrfToken,
      u: await this.usersService.findOneById(id),
      statuses,
      totalStatuses,
      totalPages,
      page: +page,
      limit: +limit,
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
    @Param('id', ParseIntPipe) id: number,
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
  @Get()
  async index(
    @User() user: UserEntity,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @CSRFToken() csrfToken: string,
    @Flash('msg') msg: object,
    @Res() response,
  ) {
    if (
      !Number.isInteger(+page) ||
      !Number.isInteger(+limit) ||
      +page <= 0 ||
      +limit > 100
    ) {
      response.redirect('/users');
      return;
    }

    const totalUsers = await this.usersService.countAll();
    const totalPages = Math.ceil(totalUsers / +limit);
    if (+page > totalPages) {
      response.redirect('/users');
      return;
    }

    return response.render('users/index.html', {
      user,
      msg,
      csrfToken,
      users: await this.usersService.paginate(+page, +limit),
      totalUsers,
      totalPages,
      page: +page,
      limit: +limit,
    });
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
}
