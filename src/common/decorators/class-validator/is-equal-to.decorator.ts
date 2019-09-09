import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

/**
 * 检查该属性的值是否与其他属性的值相同。注意：仅支持 string 和 number 类型。
 */
export function IsEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === typeof relatedValue && value === relatedValue;
        },
      },
    });
  };
}
