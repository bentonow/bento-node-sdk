import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - addField', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully queues an add_field command', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Commands.addField({
      email: 'test@example.com',
      field: {
        key: 'testField',
        value: 'testValue',
      },
    });

    expect(result).toBe(1);
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Commands.addField({
        email: 'test@example.com',
        field: {
          key: 'testField',
          value: 'testValue',
        },
      })
    ).rejects.toThrow();
  });
});
