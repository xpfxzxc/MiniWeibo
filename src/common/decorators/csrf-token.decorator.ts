import { createParamDecorator } from '@nestjs/common';

export const CSRFToken = createParamDecorator((data, req) => {
  return req.csrfToken();
});
