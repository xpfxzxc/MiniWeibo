import { RedirectIfAuthenticatedMiddleware } from './redirect-if-authenticated.middleware';

describe('RedirectIfAuthenticatedMiddleware', () => {
  it('should be defined', () => {
    expect(new RedirectIfAuthenticatedMiddleware()).toBeDefined();
  });
});
