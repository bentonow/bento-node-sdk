import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';
import { NotAuthorizedError, RateLimitedError } from '../../src';

describe('BentoClient Errors', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('throws NotAuthorizedError on 401', async () => {
    setupMockFetch({ error: 'Unauthorized' }, 401);

    expect(analytics.V1.Tags.getTags()).rejects.toThrow(NotAuthorizedError);
  });

  test('throws RateLimitedError on 429', async () => {
    setupMockFetch({ error: 'Too Many Requests' }, 429);

    expect(analytics.V1.Tags.getTags()).rejects.toThrow(RateLimitedError);
  });

  test('handles text/plain error response', async () => {
    // Update mock fetch to return text/plain error
    const errorMessage = 'Plain text error message';
    setupMockFetch(
      { error: errorMessage },
      500,
      'text/plain'
    );

    expect(analytics.V1.Tags.getTags()).rejects.toThrow(
      `[500] - ${errorMessage}`
    );
  });

  test('handles unknown content-type error response', async () => {
    setupMockFetch(
      { error: 'Unknown error' },
      500,
      'application/unknown'
    );

    expect(analytics.V1.Tags.getTags()).rejects.toThrow(
      '[500] - Unknown response from the Bento API.'
    );
  });
});