import { IsEmail } from 'class-validator';
import { IsUserAlreadyExist } from '../../../common/decorators/class-validator/is-user-already-exist.decorator';

export class SendResetLinkEmailDto {
  @IsEmail(
    {},
    {
      message: '非法邮箱地址',
    },
  )
  @IsUserAlreadyExist(true, {
    message: '该邮箱地址未被注册',
  })
  readonly email: string;
}
