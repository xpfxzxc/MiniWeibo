import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreStatusDto } from './dto/store-status.dto';
import { User } from '../users/user.entity';

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

  async store(user: User, storeStatusDto: StoreStatusDto): Promise<void> {
    const status = new Status();
    status.content = storeStatusDto.content;
    status.user = user;
    await this.statusRepository.save(status);
  }

  async destroy(id: number): Promise<boolean> {
    const statusToRemove = await this.statusRepository.findOne(id);
    if (statusToRemove) {
      await this.statusRepository.remove(statusToRemove);
      return true;
    }
    return false;
  }
}
