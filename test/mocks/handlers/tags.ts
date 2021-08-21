import { ResponseComposition, rest, RestContext } from 'msw';

export const handlers = [
  rest.get(
    'https://app.bentonow.com/api/v1/fetch/tags',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      return res(
        ctx.status(200),
        ctx.json({
          data: [
            {
              id: '174',
              type: 'tags',
              attributes: {
                name: 'test1',
                created_at: '2021-04-09T01:29:46.385Z',
                discarded_at: null,
              },
            },
          ],
        })
      );
    }
  ),
  rest.post(
    'https://app.bentonow.com/api/v1/fetch/tags',
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
              id: '174',
              type: 'tags',
              attributes: {
                name: body.tag.name,
                created_at: '2021-04-09T01:29:46.385Z',
                discarded_at: null,
              },
            },
          ],
        })
      );
    }
  ),
];

function basicAuthError(res: ResponseComposition<any>, ctx: RestContext) {
  return res(ctx.status(401), ctx.body('HTTP Basic: Access denied.'));
}
