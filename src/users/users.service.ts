import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<void> {
    user.name = updateUserDto.name;
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }
    await this.userRepository.save(user);
  }
}
