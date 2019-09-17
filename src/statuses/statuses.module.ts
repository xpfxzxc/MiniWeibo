import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusesService],
  exports: [StatusesService],
})
export class StatusesModule {}
