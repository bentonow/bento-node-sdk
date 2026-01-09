import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch, lastFetchSignal } from '../helpers/mockFetch';

describe('BentoBatch - importSubscribers', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully imports subscribers without timeout signal', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importSubscribers({
      subscribers: [
        {
          email: 'test@example.com',
          firstName: 'Test',
        },
      ],
    });

    expect(result).toBe(1);
    expect(lastFetchSignal).toBeNull();
  });
});
