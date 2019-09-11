import {
  Controller,
  Post,
  Res,
  Body,
  UseFilters,
  Get,
  UseGuards,
  Render,
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
  show(
    @User() user: UserEntity,
    @CSRFToken() csrfToken: string,
    @Flash('msg') msg: object,
  ) {
    return { user, csrfToken, msg };
  }
}
