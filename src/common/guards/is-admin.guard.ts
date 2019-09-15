import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return user.isAdmin;
  }
}
