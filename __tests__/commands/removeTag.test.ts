import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - removeTag', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully queues a remove_tag command', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Commands.removeTag({
      email: 'test@example.com',
      tagName: 'TestTag',
    });

    expect(result).toBe(1);
  });
});
