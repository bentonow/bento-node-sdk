import { Analytics, NotAuthorizedError } from '../src';

describe('Subscribers', () => {
  it('Throws an unauthorized error when authorization fails.', async () => {
    const bento = new Analytics({
      authentication: {
        privateKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    await expect(bento.Subscribers.getSubscribers()).rejects.toThrow(
      NotAuthorizedError
    );
  });
});
