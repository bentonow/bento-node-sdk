import { NotAuthorizedError } from '../src';
import { BentoClient } from '../src/sdk';

describe('Subscribers', () => {
  it('Throws an unauthorized error when authorization fails.', async () => {
    const client = new BentoClient({
      authentication: {
        privateKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    await expect(client.get('/test')).rejects.toThrow(NotAuthorizedError);
  });
});
