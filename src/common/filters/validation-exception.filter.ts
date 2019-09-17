import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException, UnauthorizedException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private refillFieldOptions: {
      includes?: string[];
      excludes?: string[];
      stripCSRFToken?: boolean;
      redirectToURL?: string | undefined | null;
    } = {},
  ) {}

  async catch(
    exception: BadRequestException | UnauthorizedException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const old: object = {};
    if (this.refillFieldOptions.includes) {
      for (const name of this.refillFieldOptions.includes) {
        if (request.body[name] !== undefined) {
          old[name] = request.body[name];
        }
      }
    } else if (this.refillFieldOptions.excludes) {
      for (const name in request.body) {
        if (!this.refillFieldOptions.excludes.includes(name)) {
          old[name] = request.body[name];
        }
      }
    } else {
      for (const name in request.body) {
        old[name] = request.body[name];
      }
    }

    if (
      this.refillFieldOptions.stripCSRFToken === undefined ||
      this.refillFieldOptions.stripCSRFToken === true
    ) {
      delete old['_csrf'];
    } else {
      old['_csrf'] = request.body['_csrf'];
    }

    (request as any).flash('old', old);

    const message: string[] | string = (exception.getResponse() as any).message;
    (request as any).flash(
      'errors',
      Array.isArray(message) ? message : [message],
    );

    if (this.refillFieldOptions.redirectToURL === undefined) {
      response.redirect('back');
    } else if (this.refillFieldOptions.redirectToURL !== null) {
      response.redirect(this.refillFieldOptions.redirectToURL);
    } else {
      request.next();
    }
  }
}
