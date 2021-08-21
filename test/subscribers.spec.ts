import { Analytics } from '../src';

describe('Subscribers /fetch/subscribers', () => {
  it('Works without any parameters', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(bento.Subscribers.getSubscribers()).resolves.toBeNull();
  });

  it('Works with a UUID', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Subscribers.getSubscribers({
        uuid: '1234',
      })
    ).resolves.toMatchObject({
      id: '236',
      type: 'visitors',
      attributes: {
        uuid: '1234',
        email: 'jesse@bentonow.com',
        fields: {},
        cached_tag_ids: [],
      },
    });
  });

  it('Works with an email', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Subscribers.getSubscribers({
        email: 'test@bentonow.com',
      })
    ).resolves.toMatchObject({
      id: '236',
      type: 'visitors',
      attributes: {
        uuid: '0f566d05f47a59bff25f147df3a6233d',
        email: 'test@bentonow.com',
        fields: {},
        cached_tag_ids: [],
      },
    });
  });
});
