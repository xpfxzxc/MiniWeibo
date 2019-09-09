import { MaxLength, IsEmail, MinLength, Allow, Length } from 'class-validator';
import { IsEqualTo } from '../../common/decorators/class-validator/is-equal-to.decorator';
import { IsUserAlreadyExist } from '../../common/decorators/class-validator/is-user-already-exist.decorator';

export class StoreUserDto {
  @Length(2, 30, {
    message: '名称长度为 $constraint1 到 $constraint2 个字符',
  })
  readonly name: string;

  @IsEmail(
    {},
    {
      message: '非法邮箱地址',
    },
  )
  @MaxLength(255, {
    message: '邮箱地址至多为 $constraint1 个字符',
  })
  @IsUserAlreadyExist({
    message: '邮箱已经被注册过了',
  })
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
}
