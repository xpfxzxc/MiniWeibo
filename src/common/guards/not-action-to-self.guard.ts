import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';

@Injectable()
export class NotActionToSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const params = request.params;
    return user.id !== +params.id;
  }
}
