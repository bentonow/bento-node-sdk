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

    expect(bento.V1.Batch).toBeTruthy();
    expect(bento.V1.Commands).toBeTruthy();
    expect(bento.V1.Experimental).toBeTruthy();
    expect(bento.V1.Fields).toBeTruthy();
    expect(bento.V1.Forms).toBeTruthy();
    expect(bento.V1.Subscribers).toBeTruthy();
    expect(bento.V1.Tags).toBeTruthy();
  });
});
