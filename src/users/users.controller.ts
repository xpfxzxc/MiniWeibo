import { Controller, Post, Res, Body } from '@nestjs/common';
import { StoreUserDto } from './dto/store-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async store(@Body() storeUserDto: StoreUserDto, @Res() res: Response) {
    const id = await this.usersService.store(storeUserDto);
    res.redirect(`/users/${id}`);
  }
}
