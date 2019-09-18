import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common';

export class PaginationQueryException extends HttpException {
  constructor() {
    super('Invalid pagination query', HttpStatus.BAD_REQUEST);
  }
}
