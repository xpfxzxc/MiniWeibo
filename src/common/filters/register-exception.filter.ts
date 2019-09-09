import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class RegisterExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    (request as any).flash('errors', (exception.getResponse() as any).message);
    response.redirect('/register');
  }
}
