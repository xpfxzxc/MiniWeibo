import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((key, req) => {
  return key ? req.user && req.user[key] : req.user;
});
