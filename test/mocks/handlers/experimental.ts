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
  rest.get(
    'https://app.bentonow.com/api/v1/experimental/geolocation',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const ip = req.url.searchParams.get('ip');

      if (ip === '127.0.0.1') return res(ctx.status(201), ctx.json({}));
      return res(
        ctx.status(201),
        ctx.json({
          ip: 'XXX.XX.XXX.XX',
          request: 'XXX.XX.XXX.XX',
          latitude: 0.0,
          city_name: 'Earth',
          longitude: 0.0,
          postal_code: '00000',
          region_name: '00',
          country_name: 'Country',
          country_code2: 'CO',
          country_code3: 'COU',
          continent_code: 'EA',
          real_region_name: 'Earth',
        })
      );
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
