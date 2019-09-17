import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async countAllForUser(userId: number): Promise<number> {
    return this.statusRepository
      .createQueryBuilder('status')
      .innerJoin('status.user', 'user')
      .where('status.user_id = :id', { id: userId })
      .getCount();
  }

  async paginateForUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Status[]> {
    return this.statusRepository
      .createQueryBuilder('status')
      .innerJoin('status.user', 'user')
      .where('status.user_id = :id', { id: userId })
      .orderBy('status.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }
}
