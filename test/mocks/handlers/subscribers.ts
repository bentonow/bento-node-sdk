import { ResponseComposition, rest, RestContext } from 'msw';

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
];

function basicAuthError(res: ResponseComposition<any>, ctx: RestContext) {
  return res(ctx.status(401), ctx.body('HTTP Basic: Access denied.'));
}
