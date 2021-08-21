import { Analytics } from '../src';

describe('Analytics', () => {
  it('Properly exposes the Subscribers module.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    expect(bento.Subscribers).toBeTruthy();
    expect(bento.Tags).toBeTruthy();
  });
});
