import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Follower } from './follower.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    private readonly usersService: UsersService,
  ) {}

  async isFollowing(userId: number, followerId: number): Promise<boolean> {
    return !!(await this.followerRepository.findOne({
      relations: ['user', 'follower'],
      where: {
        user: {
          id: userId,
        },
        follower: {
          id: followerId,
        },
      },
    }));
  }

  async store(userId: number, follower: User): Promise<void> {
    const user = await this.usersService.findOneById(userId);

    if (user && !(await this.isFollowing(userId, follower.id))) {
      const followerRow = new Follower();
      followerRow.user = user;
      followerRow.follower = follower;
      await this.followerRepository.save(followerRow);
    }
  }

  async destroy(userId: number, follower: User): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    if (user) {
      const followerRowToRemove = new Follower();
      followerRowToRemove.user = user;
      followerRowToRemove.follower = follower;
      await this.followerRepository.remove(followerRowToRemove);
    }
  }
}
