import { ResponseComposition, rest, RestContext } from 'msw';

export const handlers = [
  rest.get(
    'https://app.bentonow.com/api/v1/test',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      return res(ctx.status(200));
    }
  ),
  rest.post(
    'https://app.bentonow.com/api/v1/test',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      return res(ctx.status(200));
    }
  ),
];

function basicAuthError(res: ResponseComposition<any>, ctx: RestContext) {
  return res(ctx.status(401), ctx.body('HTTP Basic: Access denied.'));
}
