import { Analytics } from '../src';

describe('Post Commands [/fetch/commands]', () => {
  it('Can add a tag', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Commands.addTag({
        email: 'test@bentonow.com',
        tagName: 'test-tag',
      })
    ).resolves.toMatchObject({
      id: '444792518',
      type: 'visitors',
      attributes: {
        uuid: '090289b2a1cf40e8a85507eb9ae73684',
        email: 'test@bentonow.com',
        fields: null,
        cached_tag_ids: [`1096`],
        unsubscribed_at: null,
      },
    });
  });

  it('Can remove a tag', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Commands.removeTag({
        email: 'test@bentonow.com',
        tagName: 'test-tag',
      })
    ).resolves.toMatchObject({
      id: '444792518',
      type: 'visitors',
      attributes: {
        uuid: '090289b2a1cf40e8a85507eb9ae73684',
        email: 'test@bentonow.com',
        fields: null,
        cached_tag_ids: [`1097`],
        unsubscribed_at: null,
      },
    });
  });

  it('Can add a field', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Commands.addField({
        email: 'test@bentonow.com',
        field: {
          key: 'testKey',
          value: 'testValue',
        },
      })
    ).resolves.toMatchObject({
      id: '444792518',
      type: 'visitors',
      attributes: {
        uuid: '090289b2a1cf40e8a85507eb9ae73684',
        email: 'test@bentonow.com',
        fields: {
          testKey: 'testValue',
        },
        cached_tag_ids: [],
        unsubscribed_at: null,
      },
    });
  });

  it('Can remove a field', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Commands.removeField({
        email: 'test@bentonow.com',
        fieldName: 'testField',
      })
    ).resolves.toMatchObject({
      id: '444792518',
      type: 'visitors',
      attributes: {
        uuid: '090289b2a1cf40e8a85507eb9ae73684',
        email: 'test@bentonow.com',
        fields: {
          definitelyNottestField: '',
        },
        cached_tag_ids: [],
        unsubscribed_at: null,
      },
    });
  });
});
