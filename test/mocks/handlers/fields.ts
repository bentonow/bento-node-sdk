import { ResponseComposition, rest, RestContext } from 'msw';

import { basicAuthError } from './_shared';

export const handlers = [
  rest.get(
    'https://app.bentonow.com/api/v1/fetch/fields',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      return res(
        ctx.status(200),
        ctx.json({
          data: [
            {
              id: '2327',
              type: 'visitors-fields',
              attributes: {
                name: 'Phone',
                key: 'phone',
                whitelisted: null,
                created_at: '2021-08-21T02:08:30.364Z',
              },
            },
            {
              id: '2326',
              type: 'visitors-fields',
              attributes: {
                name: 'Last Name',
                key: 'last_name',
                whitelisted: null,
                created_at: '2021-08-21T02:08:30.356Z',
              },
            },
            {
              id: '2325',
              type: 'visitors-fields',
              attributes: {
                name: 'First Name',
                key: 'first_name',
                whitelisted: null,
                created_at: '2021-08-21T02:08:30.344Z',
              },
            },
          ],
        })
      );
    }
  ),
  rest.post(
    'https://app.bentonow.com/api/v1/fetch/fields',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const body = JSON.parse(req.body as string);

      return res(
        ctx.status(201),
        ctx.json({
          data: [
            {
              id: '2327',
              type: 'visitors-fields',
              attributes: {
                name: `${body.field.key[0].toUpperCase()}${body.field.key.slice(
                  1
                )}`,
                key: body.field.key,
                whitelisted: null,
                created_at: '2021-08-21T02:08:30.364Z',
              },
            },
          ],
        })
      );
    }
  ),
];
