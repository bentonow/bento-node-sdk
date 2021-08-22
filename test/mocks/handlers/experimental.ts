import { ResponseComposition, rest, RestContext } from 'msw';

import { basicAuthError } from './_shared';

export const handlers = [
  rest.post(
    'https://app.bentonow.com/api/v1/experimental/validation',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const { ip } = JSON.parse(req.body as string);

      return res(
        ctx.status(201),
        ctx.json({
          valid: ip === '0.0.0.0' ? false : true,
        })
      );
    }
  ),
  rest.post(
    'https://app.bentonow.com/api/v1/experimental/gender',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const { name } = JSON.parse(req.body as string);

      return res(ctx.status(201), ctx.json(getGenderResult(name)));
    }
  ),
];

function getGenderResult(name: string) {
  let gender = 'unknown';
  let confidence = null;

  if (name === 'Jesse') {
    gender = 'male';
    confidence = 0.9631336405529953;
  }

  if (name === 'Barb') {
    gender = 'female';
    confidence = 0.9230769230769231;
  }

  return {
    confidence,
    gender,
  };
}
