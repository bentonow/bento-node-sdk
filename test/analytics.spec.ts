import { Analytics } from '../src';

describe('Analytics', () => {
  it('Properly exposes the Subscribers module.', async () => {
    const bento = new Analytics({
      authentication: {
        privateKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    expect(bento.Subscribers).toBeTruthy();
  });
});
