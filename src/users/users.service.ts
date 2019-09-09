import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { StoreUserDto } from './dto/store-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async store(storeUserDto: StoreUserDto): Promise<number> {
    const fillableFields = ['name', 'email', 'password'];

    const user = new User();
    for (const field of fillableFields) {
      user[field] = storeUserDto[field];
    }

    return (await this.userRepository.save(user)).id;
  }

  async isUserAlreadyExist(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({ email: email }));
  }
}
