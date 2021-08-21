import { rest } from 'msw';

export const handlers = [
  rest.get(
    'https://app.bentonow.com/api/v1/fetch/subscribers',
    (req, res, ctx) => {
      console.log(req);

      return res(
        ctx.status(200),
        ctx.json({
          data: {
            id: '236',
            type: 'visitors',
            attributes: {
              uuid: '0f566d05f47a59bff25f147df3a6233d',
              email: 'jesse@bentonow.com',
              fields: {},
              cached_tag_ids: [],
            },
          },
        })
      );
    }
  ),
];
