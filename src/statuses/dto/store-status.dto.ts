import { Length } from 'class-validator';

export class StoreStatusDto {
  @Length(2, 140, {
    message: '微博内容长度为 $constraint1 到 $constraint2 个字符',
  })
  readonly content;
}
