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
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(
    new ValidationExceptionFilter({
      includes: ['name', 'email'],
      stripCSRFToken: false,
    }),
  )
  async store(
    @Body(ValidationFeedbackPipe) storeUserDto: StoreUserDto,
    @Res() res: Response,
  ) {
    const id = await this.usersService.store(storeUserDto);
    res.redirect(`/users/${id}`);
  }
}
