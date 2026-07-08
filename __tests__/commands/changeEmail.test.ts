import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - changeEmail', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully queues a change_email command', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Commands.changeEmail({
      oldEmail: 'old@example.com',
      newEmail: 'new@example.com',
    });

    expect(result).toBe(1);
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
