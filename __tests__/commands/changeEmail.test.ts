import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { mockSubscriberResponse } from '../helpers/mockResponses';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - changeEmail', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully changes email address', async () => {
    const oldEmail = 'old@example.com';
    const newEmail = 'new@example.com';
    setupMockFetch(mockSubscriberResponse(newEmail));

    const result = await analytics.V1.Commands.changeEmail({
      oldEmail,
      newEmail
    });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe(newEmail);
  });

  test('returns null when response is empty', async () => {
    setupMockFetch({ data: null });

    const result = await analytics.V1.Commands.changeEmail({
      oldEmail: 'old@example.com',
      newEmail: 'new@example.com'
    });

    expect(result).toBeNull();
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Commands.changeEmail({
        oldEmail: 'old@example.com',
        newEmail: 'new@example.com',
      })
    ).rejects.toThrow();
  });
});