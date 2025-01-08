import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { mockSubscriberResponse } from '../helpers/mockResponses';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - addTag', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully adds a tag to a subscriber', async () => {
    const email = 'test@example.com';
    const tagName = 'TestTag';
    setupMockFetch(mockSubscriberResponse(email, ['tag-123']));

    const result = await analytics.V1.Commands.addTag({ email, tagName });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe(email);
    expect(result?.attributes.cached_tag_ids).toContain('tag-123');
  });

  test('returns null when response is empty', async () => {
    setupMockFetch({ data: null });

    const result = await analytics.V1.Commands.addTag({
      email: 'test@example.com',
      tagName: 'TestTag'
    });

    expect(result).toBeNull();
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Commands.addTag({
        email: 'test@example.com',
        tagName: 'TestTag',
      })
    ).rejects.toThrow();
  });
});