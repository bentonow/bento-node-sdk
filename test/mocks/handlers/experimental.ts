import type { ResponseComposition, RestContext } from 'msw';
import { rest } from 'msw';

import { basicAuthError } from './_shared';

export const handlers = [
  rest.post(
    'https://app.bentonow.com/api/v1/experimental/validation',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const { ip } = req.body as any;

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

      const { name } = req.body as any;

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
  rest.get(
    'https://app.bentonow.com/api/v1/experimental/blacklist.json',
    (req, res: ResponseComposition<any>, ctx: RestContext) => {
      if (req.headers.get('Authorization') !== 'Basic dGVzdDp0ZXN0') {
        return basicAuthError(res, ctx);
      }

      const ip = req.url.searchParams.get('ip');
      const domain = req.url.searchParams.get('domain');

      if (ip)
        return res(
          ctx.status(201),
          ctx.json({
            query: ip,
            description:
              'If any of the following blacklist providers contains true you have a problem on your hand.',
            results: {
              spamhaus: false,
              nordspam: true,
            },
          })
        );
      return res(
        ctx.status(201),
        ctx.json({
          query: domain,
          description:
            'If any of the following blacklist providers contains true you have a problem on your hand.',
          results: {
            just_registered: false,
            spamhaus: false,
            nordspam: false,
            spfbl: false,
            sorbs: false,
            abusix: false,
          },
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
