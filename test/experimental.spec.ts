import { Analytics } from '../src';

describe('Validate Email [/experimental/validation]', () => {
  it('Works with just an email.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Experimental.validateEmail({
        email: 'test@bentonow.com',
      })
    ).resolves.toBe(true);
  });

  it('Fails with an IP address of 0.0.0.0.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Experimental.validateEmail({
        email: 'test@bentonow.com',
        ip: '0.0.0.0',
      })
    ).resolves.toBe(false);
  });
});
