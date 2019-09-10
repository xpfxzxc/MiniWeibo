import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, id: string) => void): any {
    done(null, user.id);
  }

  async deserializeUser(
    id: string,
    done: (err: Error, user: User) => void,
  ): Promise<any> {
    done(null, await this.usersService.findOneById(id));
  }
}
