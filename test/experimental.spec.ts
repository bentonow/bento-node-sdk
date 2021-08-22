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

describe('Guess Gender [/experimental/gender]', () => {
  it('Works with male.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Experimental.guessGender({
        name: 'Jesse',
      })
    ).resolves.toMatchObject({
      confidence: 0.9631336405529953,
      gender: 'male',
    });
  });

  it('Works with female.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Experimental.guessGender({
        name: 'Barb',
      })
    ).resolves.toMatchObject({
      confidence: 0.9230769230769231,
      gender: 'female',
    });
  });

  it('Works with unknown.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Experimental.guessGender({
        name: 'Who?',
      })
    ).resolves.toMatchObject({
      confidence: null,
      gender: 'unknown',
    });
  });
});
