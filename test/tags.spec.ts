import { Analytics } from '../src';

describe('[V1] Get Tags [/fetch/tags]', () => {
  it('Works without any parameters', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(bento.V1.Tags.getTags()).resolves.toMatchObject([
      {
        id: '174',
        type: 'tags',
        attributes: {
          name: 'test1',
          created_at: '2021-04-09T01:29:46.385Z',
          discarded_at: null,
        },
      },
    ]);
  });
});

describe('[V1] Post Tags [/fetch/tags]', () => {
  it('Works with a name.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Tags.createTag({
        name: 'test tag',
      })
    ).resolves.toMatchObject([
      {
        id: '174',
        type: 'tags',
        attributes: {
          name: 'test tag',
          created_at: '2021-04-09T01:29:46.385Z',
          discarded_at: null,
        },
      },
    ]);
  });
});
