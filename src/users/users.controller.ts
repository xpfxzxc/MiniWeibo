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
  ForbiddenException,
  Query,
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    @Param('id') id,
    @User() user: UserEntity,
    @CSRFToken() csrfToken: string,
    @Flash('msg') msg: object,
  ) {
    return { user, u: await this.usersService.findOneById(id), csrfToken, msg };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/edit')
  @Render('users/edit.html')
  edit(
    @User() user: UserEntity,
    @CSRFToken() csrfToken: string,
    @Flash('errors') errors: string[],
    @Flash('msg') msg: object,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException();
    }

    return { user, csrfToken, errors, msg };
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(new ValidationExceptionFilter({ includes: [] }))
  @Patch(':id')
  async update(
    @Body(ValidationFeedbackPipe) updateUserDto: UpdateUserDto,
    @Request() request,
    @Res() response,
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException();
    }

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
      csrfToken,
      users: await this.usersService.paginate(+page, +limit),
      totalUsers,
      totalPages,
      page: +page,
      limit: +limit,
    });
  }
}
