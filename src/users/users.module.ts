import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IsUserAlreadyExistConstraint } from '../common/decorators/class-validator/is-user-already-exist.decorator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, IsUserAlreadyExistConstraint],
  exports: [UsersService],
})
export class UsersModule {}
