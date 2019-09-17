import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './status.entity';
import { StatusesController } from './statuses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusesService],
  exports: [StatusesService],
  controllers: [StatusesController],
})
export class StatusesModule {}
