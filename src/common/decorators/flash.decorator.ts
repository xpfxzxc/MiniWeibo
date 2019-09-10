import { createParamDecorator } from '@nestjs/common';

export const Flash = createParamDecorator((type, req) => {
  const msg = req.flash(type);

  if (Array.isArray(msg) && msg.length > 0) {
    return typeof msg[0] === 'object' ? msg[0] : msg;
  }

  return msg;
});
