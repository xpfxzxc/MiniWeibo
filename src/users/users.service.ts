import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async paginate(page: number = 1, limit: number = 10): Promise<User[]> {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
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
}
