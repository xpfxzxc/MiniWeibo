import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RedirectIfAuthenticatedMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.isAuthenticated()) {
      req.flash('msg', { info: '您已登录，无需再次操作' });
      res.redirect('/');
    } else {
      next();
    }
  }
}
