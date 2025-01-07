import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { mockSubscriberResponse } from '../helpers/mockResponses';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - removeTag', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully removes a tag from a subscriber', async () => {
    const email = 'test@example.com';
    setupMockFetch(mockSubscriberResponse(email, []));

    const result = await analytics.V1.Commands.removeTag({
      email,
      tagName: 'TestTag'
    });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe(email);
    expect(result?.attributes.cached_tag_ids).toHaveLength(0);
  });

  test('returns null when response is empty', async () => {
    setupMockFetch({ data: null });

    const result = await analytics.V1.Commands.removeTag({
      email: 'test@example.com',
      tagName: 'TestTag'
    });

    expect(result).toBeNull();
  });
});