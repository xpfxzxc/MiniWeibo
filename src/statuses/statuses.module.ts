import { Module, forwardRef } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './status.entity';
import { StatusesController } from './statuses.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Status]), forwardRef(() => UsersModule)],
  providers: [StatusesService],
  exports: [StatusesService],
  controllers: [StatusesController],
})
export class StatusesModule {}
