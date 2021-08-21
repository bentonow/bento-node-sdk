import { ResponseComposition, RestContext } from 'msw';

export function basicAuthError(
  res: ResponseComposition<any>,
  ctx: RestContext
) {
  return res(ctx.status(401), ctx.body('HTTP Basic: Access denied.'));
}
