import { Analytics } from '../src';

describe('[V1] Get Subscribers [/fetch/subscribers]', () => {
  it('Works without any parameters', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(bento.V1.Subscribers.getSubscribers()).resolves.toBeNull();
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
      bento.V1.Subscribers.getSubscribers({
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
      bento.V1.Subscribers.getSubscribers({
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

describe('[V1] Post Subscribers [/fetch/subscribers]', () => {
  it('Works with an email.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Subscribers.createSubscriber({
        email: 'test@bentonow.com',
      })
    ).resolves.toMatchObject({
      id: '444792648',
      type: 'visitors',
      attributes: {
        uuid: '4b6bede6f4271f8d033ca9a2d4f365eb',
        email: 'test@bentonow.com',
        fields: null,
        cached_tag_ids: [],
        unsubscribed_at: null,
      },
    });
  });
});
