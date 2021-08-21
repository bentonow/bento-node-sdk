import { Analytics } from '../src';

describe('Analytics', () => {
  it('Successfully initializes with the site UUID.', async () => {
    const bento = new Analytics({
      authentication: {
        privateKey: '',
        publishableKey: '',
      },
      siteUuid: 'test',
    });

    try {
      console.log(await bento.Subscribers.getSubscribers());
    } catch (e) {
      console.log(e);
    }
  });
});
