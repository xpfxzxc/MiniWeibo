import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IsUserAlreadyExistConstraint } from '../common/decorators/class-validator/is-user-already-exist.decorator';
import { StatusesModule } from '../statuses/statuses.module';
import { FollowersModule } from '../followers/followers.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), StatusesModule, FollowersModule],
  controllers: [UsersController],
  providers: [UsersService, IsUserAlreadyExistConstraint],
  exports: [UsersService],
})
export class UsersModule {}
