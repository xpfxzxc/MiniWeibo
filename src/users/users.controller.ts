import {
  Controller,
  Post,
  Res,
  Body,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import { StoreUserDto } from './dto/store-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { ValidationFeedbackPipe } from '../common/pipes/validation-feedback.pipe';
import { RegisterExceptionFilter } from '../common/filters/register-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(RegisterExceptionFilter)
  async store(
    @Body(ValidationFeedbackPipe) storeUserDto: StoreUserDto,
    @Res() res: Response,
  ) {
    const id = await this.usersService.store(storeUserDto);
    res.redirect(`/users/${id}`);
  }
}
