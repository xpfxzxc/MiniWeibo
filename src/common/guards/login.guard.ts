import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const errors = [];
    if (!request.body.email) {
      errors.push('邮箱地址不能为空');
    }
    if (!request.body.password) {
      errors.push('密码不能为空');
    }
    if (errors.length > 0) {
      throw new UnauthorizedException(errors);
    }

    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(request);
    await new Promise(resolve => {
      request.session.save(() => resolve());
    });
    return result;
  }
}
