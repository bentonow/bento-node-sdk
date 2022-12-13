import { Analytics } from '../src';
import { BentoEvents } from '../src/sdk/batch/enums';
import {
  TooFewEventsError,
  TooFewSubscribersError,
  TooManyEventsError,
  TooManySubscribersError,
  TooManyEmailsError,
  TooFewEmailsError,
} from '../src/sdk/batch/errors';

describe('[V1] Batch Import Subscribers [/batch/subscribers]', () => {
  it('Can import between 1 and 1,000 subscribers', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importSubscribers({
        subscribers: [
          {
            email: 'test@bentonow.com',
            age: 21,
          },
          {
            email: 'test2@bentonow.com',
          },
          {
            email: 'test3@bentonow.com',
            name: 'Third Test',
          },
        ],
      })
    ).resolves.toBe(3);
  });

  it('Errors out when importing 0 subscribers.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importSubscribers({
        subscribers: [],
      })
    ).rejects.toThrow(TooFewSubscribersError);
  });

  it('Errors out when importing 1,001 subscribers.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importSubscribers({
        subscribers: new Array(1001),
      })
    ).rejects.toThrow(TooManySubscribersError);
  });
});

describe('[V1] Batch Import Events [/batch/events]', () => {
  it('Can import between 1 and 1,000 events', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importEvents({
        events: [
          {
            email: 'test@bentonow.com',
            type: BentoEvents.SUBSCRIBE,
          },
          {
            email: 'test@bentonow.com',
            type: BentoEvents.UNSUBSCRIBE,
          },
          {
            email: 'test@bentonow.com',
            details: {
              tag: 'Test Tag',
            },
            type: BentoEvents.TAG,
          },
        ],
      })
    ).resolves.toBe(3);
  });

  it('Errors out when importing 0 events.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importEvents({
        events: [],
      })
    ).rejects.toThrow(TooFewEventsError);
  });

  it('Errors out when importing 1,001 events.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importEvents({
        events: new Array(1001),
      })
    ).rejects.toThrow(TooManyEventsError);
  });
});

describe('[V1] Batch Import Emails [/batch/emails]', () => {
  it('Can import between 1 and 100 emails', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importEmails({
        emails: [
          {
            to: 'test_one@bentonow.com',
            from: 'jesse@bentonow.com',
            subject: 'Reset Password',
            html_body:
              '<p>Here is a link to reset your password ... {{ link }}</p>',
            transactional: true,
            personalizations: {
              link: 'https://example.com/test',
            },
          },
          {
            to: 'test_two@bentonow.com',
            from: 'jesse@bentonow.com',
            subject: 'Reset Password',
            html_body:
              '<p>Here is a link to reset your password ... {{ link }}</p>',
            transactional: true,
            personalizations: {
              link: 'https://example.com/test',
            },
          },
        ],
      })
    ).resolves.toBe(2);
  });

  it('Errors out when importing 0 events.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importEmails({
        emails: [],
      })
    ).rejects.toThrow(TooFewEmailsError);
  });

  it('Errors out when importing 101 events.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.V1.Batch.importEmails({
        emails: new Array(101),
      })
    ).rejects.toThrow(TooManyEmailsError);
  });
});
