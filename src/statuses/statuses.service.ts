import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreStatusDto } from './dto/store-status.dto';
import { User } from '../users/user.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { UsersService } from '../users/users.service';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    private readonly usersService: UsersService,
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
    options: IPaginationOptions,
  ): Promise<Pagination<Status>> {
    const queryBuilder = this.statusRepository.createQueryBuilder('status');
    queryBuilder
      .innerJoin('status.user', 'user')
      .where('status.user_id = :id', { id: userId })
      .orderBy('status.createdAt', 'DESC');
    return paginate<Status>(queryBuilder, options);
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

  async paginateFeed(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Status>> {
    const userIds = await this.usersService.getAllFollowingsIdsById(userId);
    userIds.push(userId);

    const queryBuilder = this.statusRepository
      .createQueryBuilder('status')
      .innerJoinAndSelect('status.user', 'user')
      .where('status.user_id IN (:...id)', { id: userIds })
      .orderBy('status.createdAt', 'DESC');
    return paginate<Status>(queryBuilder, options);
  }
}
