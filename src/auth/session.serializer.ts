import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, id: number) => void): any {
    done(null, user.id);
  }

  async deserializeUser(
    id: number,
    done: (err: Error, user: User) => void,
  ): Promise<any> {
    done(null, await this.usersService.findOneById(id));
  }
}
