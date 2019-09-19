import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Res,
  Delete,
} from '@nestjs/common';
import { User as UserEntity } from '../users/user.entity';
import { User } from '../common/decorators/user.decorator';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { NotActionToSelfGuard } from '../common/guards/not-action-to-self.guard';
import { FollowersService } from './followers.service';

@Controller('users/followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @UseGuards(AuthenticatedGuard, NotActionToSelfGuard)
  @Post(':id')
  async store(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ) {
    await this.followersService.store(id, user);
    response.redirect(`/users/${id}`);
  }

  @UseGuards(AuthenticatedGuard, NotActionToSelfGuard)
  @Delete(':id')
  async destroy(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ) {
    await this.followersService.destroy(id, user);
    response.redirect(`/users/${id}`);
  }
}
