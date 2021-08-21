import { ResponseComposition, rest, RestContext } from 'msw';

import { basicAuthError } from './_shared';

export const handlers = [
  rest.post(
    'https://app.bentonow.com/api/v1/fetch/commands',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const body = JSON.parse(req.body as string);
      const command = body.command.command;
      const email = body.command.email;
      const query = body.command.query;

      switch (command) {
        case 'add_tag':
          return addTagResponse(query, email, res, ctx);
        case 'remove_tag':
          return removeTagResponse(query, email, res, ctx);
        case 'add_field':
          return addFieldResponse(query, email, res, ctx);
      }

      return res(ctx.status(500));
    }
  ),
];

function addTagResponse(
  tagName: string,
  email: string,
  res: ResponseComposition,
  ctx: RestContext
) {
  const fakeId = `10${tagName.length * 12}`;

  return res(
    ctx.status(201),
    ctx.json({
      data: {
        id: '444792518',
        type: 'visitors',
        attributes: {
          uuid: '090289b2a1cf40e8a85507eb9ae73684',
          email: email,
          fields: null,
          cached_tag_ids: [fakeId],
          unsubscribed_at: null,
        },
      },
    })
  );
}

function removeTagResponse(
  tagName: string,
  email: string,
  res: ResponseComposition,
  ctx: RestContext
) {
  const fakeId = `10${tagName.length * 12 + 1}`;

  return res(
    ctx.status(201),
    ctx.json({
      data: {
        id: '444792518',
        type: 'visitors',
        attributes: {
          uuid: '090289b2a1cf40e8a85507eb9ae73684',
          email: email,
          fields: null,
          cached_tag_ids: [fakeId],
          unsubscribed_at: null,
        },
      },
    })
  );
}

function addFieldResponse(
  field: { key: string; value: string },
  email: string,
  res: ResponseComposition,
  ctx: RestContext
) {
  return res(
    ctx.status(201),
    ctx.json({
      data: {
        id: '444792518',
        type: 'visitors',
        attributes: {
          uuid: '090289b2a1cf40e8a85507eb9ae73684',
          email: email,
          fields: [field],
          cached_tag_ids: [],
          unsubscribed_at: null,
        },
      },
    })
  );
}
