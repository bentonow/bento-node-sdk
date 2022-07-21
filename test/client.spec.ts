import { NotAuthorizedError, RateLimitedError } from '../src';
import { BentoClient } from '../src/sdk';

describe('Subscribers', () => {
  it('Throws an unauthorized error when authorization fails.', async () => {
    const client = new BentoClient({
      authentication: {
        secretKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    await expect(client.get('/test')).rejects.toThrow(NotAuthorizedError);
  });
});

describe('Error handling', () => {
  it('Throws a rate limited error.', async () => {
    const client = new BentoClient({
      authentication: {
        secretKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    await expect(client.get('/rate-limit')).rejects.toThrow(RateLimitedError);
  });

  it('Returns a text error properly', async () => {
    const client = new BentoClient({
      authentication: {
        secretKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    await expect(client.post('/test/text')).rejects.toThrow(
      new Error(
        `[400] - This is a test message returned back with a failed status code.`
      )
    );
  });

  it('Returns a JSON error properly', async () => {
    const client = new BentoClient({
      authentication: {
        secretKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    await expect(client.post('/test/json')).rejects.toThrow(
      new Error(
        `[500] - {"message":"This is a JSON body returned back with a failed status code."}`
      )
    );
  });
});
