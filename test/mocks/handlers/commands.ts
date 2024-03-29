import type { ResponseComposition, RestContext } from 'msw';
import { rest } from 'msw';

import { basicAuthError } from './_shared';

export const handlers = [
  rest.post(
    'https://app.bentonow.com/api/v1/fetch/commands',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const body = req.body as any;
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
        case 'remove_field':
          return removeFieldResponse(query, email, res, ctx);
        case 'subscribe':
          return subscribeResponse(email, res, ctx);
        case 'unsubscribe':
          return unsubscribeResponse(email, res, ctx);
        case 'change_email':
          return changeEmailResponse(email, query, res, ctx);
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
          fields: { [field.key]: field.value },
          cached_tag_ids: [],
          unsubscribed_at: null,
        },
      },
    })
  );
}

function removeFieldResponse(
  fieldName: string,
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
          fields: {
            [`definitelyNot${fieldName}`]: '',
          },
          cached_tag_ids: [],
          unsubscribed_at: null,
        },
      },
    })
  );
}

function subscribeResponse(
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
          fields: null,
          cached_tag_ids: [],
          unsubscribed_at: null,
        },
      },
    })
  );
}

function unsubscribeResponse(
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
          fields: null,
          cached_tag_ids: [],
          unsubscribed_at: '2021-08-21T09:11:55.587Z',
        },
      },
    })
  );
}

function changeEmailResponse(
  _email: string,
  query: string,
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
          email: query,
          fields: null,
          cached_tag_ids: [],
          unsubscribed_at: '2021-08-21T09:11:55.587Z',
        },
      },
    })
  );
}
