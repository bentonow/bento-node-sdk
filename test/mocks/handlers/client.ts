import { ResponseComposition, rest, RestContext } from 'msw';

import { basicAuthError } from './_shared';

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
