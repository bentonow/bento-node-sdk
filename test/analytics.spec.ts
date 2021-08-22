import { Analytics } from '../src';

describe('Analytics Base', () => {
  it('Properly exposes the Subscribers module.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    expect(bento.V1.Batch).toBeTruthy();
    expect(bento.V1.Commands).toBeTruthy();
    expect(bento.V1.Experimental).toBeTruthy();
    expect(bento.V1.Fields).toBeTruthy();
    expect(bento.V1.Forms).toBeTruthy();
    expect(bento.V1.Subscribers).toBeTruthy();
    expect(bento.V1.Tags).toBeTruthy();
  });
});

describe('Analytics Integrated Events', () => {
  it('Can tag a subscriber.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.tagSubscriber({
        email: 'test@bentonow.com',
        tagName: 'Test Tag',
      })
    ).resolves.toBe(true);
  });

  it('Can subscribe an email.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.addSubscriber({
        email: 'test@bentonow.com',
      })
    ).resolves.toBe(true);
  });
});
