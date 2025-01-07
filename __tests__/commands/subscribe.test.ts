import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { mockSubscriberResponse } from '../helpers/mockResponses';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - subscribe', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully subscribes a user', async () => {
    const email = 'test@example.com';
    setupMockFetch(mockSubscriberResponse(email));

    const result = await analytics.V1.Commands.subscribe({ email });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe(email);
    expect(result?.attributes.unsubscribed_at).toBeNull();
  });

  test('returns null when response is empty', async () => {
    setupMockFetch({ data: null });

    const result = await analytics.V1.Commands.subscribe({
      email: 'test@example.com'
    });

    expect(result).toBeNull();
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Commands.subscribe({
        email: 'test@example.com',
      })
    ).rejects.toThrow();
  });
});