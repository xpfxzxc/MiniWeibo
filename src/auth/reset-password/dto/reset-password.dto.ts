import { IsEmail, MinLength, Allow, IsDefined } from 'class-validator';
import { IsEqualTo } from '../../..//common/decorators/class-validator/is-equal-to.decorator';

export class ResetPasswordDto {
  @IsEmail(
    {},
    {
      message: '非法邮箱地址',
    },
  )
  readonly email: string;

  @MinLength(6, {
    message: '密码长度至少为 $constraint1 个字符',
  })
  @IsEqualTo('password_confirmation', {
    message: '两次密码输入不一致',
  })
  readonly password: string;

  @Allow()
  readonly password_confirmation: string;

  @IsDefined({
    message: '重置密码令牌不能为空',
  })
  readonly token: string;
}
