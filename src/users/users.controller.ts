import { Controller, Post, Res, Body, UsePipes } from '@nestjs/common';
import { StoreUserDto } from './dto/store-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { ValidationFeedbackPipe } from '../common/pipes/validation-feedback.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async store(
    @Body(ValidationFeedbackPipe) storeUserDto: StoreUserDto,
    @Res() res: Response,
  ) {
    const id = await this.usersService.store(storeUserDto);
    res.redirect(`/users/${id}`);
  }
}
