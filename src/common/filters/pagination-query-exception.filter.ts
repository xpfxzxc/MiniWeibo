import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PaginationQueryException } from '../exceptions/pagination-query.exception';
import { Request, Response } from 'express';

@Catch(PaginationQueryException)
export class PaginationQueryExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const originalUrl = request.originalUrl;
    const urlToRedirect = originalUrl.slice(0, originalUrl.indexOf('?'));
    response.redirect(urlToRedirect);
  }
}
