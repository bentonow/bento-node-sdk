import type { ResponseComposition, RestContext } from 'msw';
import { rest } from 'msw';

import { basicAuthError } from './_shared';

export const handlers = [
  rest.get(
    'https://app.bentonow.com/api/v1/fetch/subscribers',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const uuid = req.url.searchParams.get('uuid');
      const email = req.url.searchParams.get('email');

      let returnBody = {};

      if (uuid || email) {
        returnBody = {
          data: {
            id: '236',
            type: 'visitors',
            attributes: {
              uuid: uuid || '0f566d05f47a59bff25f147df3a6233d',
              email: email || 'jesse@bentonow.com',
              fields: {},
              cached_tag_ids: [],
            },
          },
        };
      }

      return res(ctx.status(200), ctx.json(returnBody));
    }
  ),
  rest.post(
    'https://app.bentonow.com/api/v1/fetch/subscribers',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const body = req.body as any;

      return res(
        ctx.status(201),
        ctx.json({
          data: {
            id: '444792648',
            type: 'visitors',
            attributes: {
              uuid: '4b6bede6f4271f8d033ca9a2d4f365eb',
              email: body.subscriber.email,
              fields: null,
              cached_tag_ids: [],
              unsubscribed_at: null,
            },
          },
        })
      );
    }
  ),
];
