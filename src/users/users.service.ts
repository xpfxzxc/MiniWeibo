import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async store(storeUserDto: StoreUserDto): Promise<User> {
    const fillableFields = ['name', 'email', 'password'];

    const user = new User();
    for (const field of fillableFields) {
      user[field] = storeUserDto[field];
    }

    return this.userRepository.save(user);
  }

  async isUserAlreadyExist(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({ email: email }));
  }

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOne({ email: email });
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<void> {
    user.name = updateUserDto.name;
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.save(user);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.id', 'DESC');
    return paginate<User>(queryBuilder, options);
  }

  async countAll(): Promise<number> {
    return this.userRepository.count();
  }

  async destroy(id: number): Promise<boolean> {
    const userToRemove = await this.userRepository.findOne(id);
    if (userToRemove) {
      this.userRepository.remove(userToRemove);
      return true;
    }
    return false;
  }

  async countAllFollowingsById(id: number): Promise<number> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.followers', 'follower')
      .where('follower.id = :id', { id })
      .getCount();
  }

  async countAllFollowersById(id: number): Promise<number> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.followings', 'following')
      .where('following.id = :id', { id })
      .getCount();
  }

  async paginateFollowings(
    id: number,
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.followers', 'follower')
      .where('follower.id = :id', { id });
    return paginate<User>(queryBuilder, options);
  }

  async paginateFollowers(
    id: number,
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.followings', 'following')
      .where('following.id = :id', { id });
    return paginate<User>(queryBuilder, options);
  }

  async getAllFollowingsIdsById(id: number): Promise<number[]> {
    return (await this.userRepository.findOne({
      relations: ['followings'],
      where: { id },
    })).followings.map(following => following.id);
  }

  async activateUserByToken(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      activationToken: token,
    });
    if (user) {
      user.activationToken = null;
      user.activated = true;
      await this.userRepository.save(user);
    }
    return user;
  }

  async updateUserByEmail(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }
}
