import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { UsersService } from '../../../users/users.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(email: any, args: ValidationArguments): Promise<boolean> {
    return !(await this.usersService.isUserAlreadyExist(email));
  }
}

export function IsUserAlreadyExist(validationOptions: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUserAlreadyExist',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
