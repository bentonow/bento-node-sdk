import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { mockSubscriberResponse } from '../helpers/mockResponses';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - unsubscribe', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully unsubscribes a user', async () => {
    const email = 'test@example.com';
    const unsubscribedResponse = mockSubscriberResponse(email);
    unsubscribedResponse.data.attributes.unsubscribed_at = new Date().toISOString();
    setupMockFetch(unsubscribedResponse);

    const result = await analytics.V1.Commands.unsubscribe({ email });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe(email);
    expect(result?.attributes.unsubscribed_at).not.toBeNull();
  });

  test('returns null when response is empty', async () => {
    setupMockFetch({ data: null });

    const result = await analytics.V1.Commands.unsubscribe({
      email: 'test@example.com'
    });

    expect(result).toBeNull();
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Commands.unsubscribe({
        email: 'test@example.com',
      })
    ).rejects.toThrow();
  });
});