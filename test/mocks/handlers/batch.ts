import type { ResponseComposition, RestContext } from 'msw';
import { rest } from 'msw';

import { basicAuthError } from './_shared';

export const handlers = [
  rest.post(
    'https://app.bentonow.com/api/v1/batch/subscribers',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const body = req.body as any;

      return res(
        ctx.status(201),
        ctx.json({
          results: body.subscribers.length,
        })
      );
    }
  ),
  rest.post(
    'https://app.bentonow.com/api/v1/batch/events',
    async (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const body = req.body as { events: unknown[] };

      return res(
        ctx.status(201),
        ctx.json({
          results: body.events.length,
        })
      );
    }
  ),
];
