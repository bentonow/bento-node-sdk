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
  rest.get(
    'https://app.bentonow.com/api/v1/rate-limit',
    (_req, res: ResponseComposition<any>, ctx: RestContext) => {
      return res(ctx.status(429));
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
  rest.post(
    'https://app.bentonow.com/api/v1/test/text',
    (_req, res: ResponseComposition<any>, ctx: RestContext) => {
      return res(
        ctx.status(400),
        ctx.text(
          'This is a test message returned back with a failed status code.'
        )
      );
    }
  ),
  rest.post(
    'https://app.bentonow.com/api/v1/test/json',
    (_req, res: ResponseComposition<any>, ctx: RestContext) => {
      return res(
        ctx.status(500),
        ctx.json({
          message:
            'This is a JSON body returned back with a failed status code.',
        })
      );
    }
  ),
];
