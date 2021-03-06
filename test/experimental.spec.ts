import { Analytics } from '../src';

describe('[V1] Validate Email [/experimental/validation]', () => {
  it('Works with just an email.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Experimental.validateEmail({
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
      bento.V1.Experimental.validateEmail({
        email: 'test@bentonow.com',
        ip: '0.0.0.0',
      })
    ).resolves.toBe(false);
  });
});

describe('[V1] Guess Gender [/experimental/gender]', () => {
  it('Works with male.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Experimental.guessGender({
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
      bento.V1.Experimental.guessGender({
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
      bento.V1.Experimental.guessGender({
        name: 'Who?',
      })
    ).resolves.toMatchObject({
      confidence: null,
      gender: 'unknown',
    });
  });
});

describe('[V1] Geolocate [/experimental/geolocation]', () => {
  it('Returns null for 127.0.0.1.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Experimental.geolocate({
        ip: '127.0.0.1',
      })
    ).resolves.toBeNull();
  });

  it('Works with other IP address.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Experimental.geolocate({
        ip: '0.0.0.0',
      })
    ).resolves.toMatchObject({
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
    });
  });
});

describe('[V1] Blacklist [/experimental/blacklist.json]', () => {
  it('Returns a blacklist for any IP address', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Experimental.checkBlacklist({
        ip: '127.0.0.1',
      })
    ).resolves.toMatchObject({
      query: '127.0.0.1',
      description:
        'If any of the following blacklist providers contains true you have a problem on your hand.',
      results: {
        spamhaus: false,
        nordspam: true,
      },
    });
  });

  it('Returns no blacklist for a domain.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Experimental.checkBlacklist({
        domain: 'bentonow.com',
      })
    ).resolves.toMatchObject({
      query: 'bentonow.com',
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
    });
  });
});
