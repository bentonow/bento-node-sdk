import { Analytics } from '../src';

describe('[V1] Get Fields [/fetch/fields]', () => {
  it('Works without any parameters', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(bento.V1.Fields.getFields()).resolves.toMatchObject([
      {
        id: '2327',
        type: 'visitors-fields',
        attributes: {
          name: 'Phone',
          key: 'phone',
          whitelisted: null,
          created_at: '2021-08-21T02:08:30.364Z',
        },
      },
      {
        id: '2326',
        type: 'visitors-fields',
        attributes: {
          name: 'Last Name',
          key: 'last_name',
          whitelisted: null,
          created_at: '2021-08-21T02:08:30.356Z',
        },
      },
      {
        id: '2325',
        type: 'visitors-fields',
        attributes: {
          name: 'First Name',
          key: 'first_name',
          whitelisted: null,
          created_at: '2021-08-21T02:08:30.344Z',
        },
      },
    ]);
  });
});

describe('[V1] Post Fields [/fetch/fields]', () => {
  it('Works with a key.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Fields.createField({
        key: 'test',
      })
    ).resolves.toMatchObject([
      {
        id: '2327',
        type: 'visitors-fields',
        attributes: {
          name: 'Test',
          key: 'test',
          whitelisted: null,
          created_at: '2021-08-21T02:08:30.364Z',
        },
      },
    ]);
  });
});
