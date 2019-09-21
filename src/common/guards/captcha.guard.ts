import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CaptchaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (
      !request.body.captcha ||
      !request.session.captcha ||
      request.body.captcha !== request.session.captcha.toLowerCase()
    ) {
      throw new BadRequestException('请输入正确的验证码');
    }
    delete request.session.captcha;
    return true;
  }
}
