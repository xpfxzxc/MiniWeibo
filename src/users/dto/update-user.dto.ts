import { MinLength, Allow, Length, ValidateIf } from 'class-validator';
import { IsEqualTo } from '../../common/decorators/class-validator/is-equal-to.decorator';

export class UpdateUserDto {
  @Length(2, 30, {
    message: '名称长度为 $constraint1 到 $constraint2 个字符',
  })
  readonly name: string;

  @Allow()
  readonly email: string;

  @ValidateIf(o => o.password !== '')
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
