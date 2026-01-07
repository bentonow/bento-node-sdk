import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../../src';
import { mockOptions } from '../../helpers/mockClient';
import { setupMockFetch } from '../../helpers/mockFetch';

describe('BentoAPIV1 - upsertSubscriber', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully queues subscriber for import', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.upsertSubscriber({
      email: 'new@example.com',
      fields: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });

    // Now returns the number of subscribers queued (1)
    expect(result).toBe(1);
  });

  test('successfully queues existing subscriber for update', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.upsertSubscriber({
      email: 'existing@example.com',
      fields: {
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'Updated Corp',
      },
    });

    expect(result).toBe(1);
  });

  test('handles error during import', async () => {
    setupMockFetch({ error: 'Import failed' }, 500);

    await expect(
      analytics.V1.upsertSubscriber({
        email: 'test@example.com',
        fields: {
          firstName: 'Test',
        },
      })
    ).rejects.toThrow();
  });

  test('successfully queues subscriber with tags', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.upsertSubscriber({
      email: 'tagged@example.com',
      fields: {
        firstName: 'Tagged',
      },
      tags: 'tag-1,tag-2',
    });

    expect(result).toBe(1);
  });

  test('successfully queues subscriber with remove_tags', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.upsertSubscriber({
      email: 'removed-tags@example.com',
      fields: {
        firstName: 'Removed',
      },
      remove_tags: 'old-tag',
    });

    expect(result).toBe(1);
  });

  test('successfully queues subscriber with both tags and remove_tags', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.upsertSubscriber({
      email: 'both-tags@example.com',
      fields: {
        firstName: 'Both',
      },
      tags: 'new-tag',
      remove_tags: 'old-tag',
    });

    expect(result).toBe(1);
  });

  test('successfully queues subscriber with empty fields', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.upsertSubscriber({
      email: 'minimal@example.com',
      fields: {},
    });

    expect(result).toBe(1);
  });

  test('returns 0 when no subscribers are queued', async () => {
    setupMockFetch({ results: 0 });

    const result = await analytics.V1.upsertSubscriber({
      email: 'test@example.com',
      fields: {},
    });

    expect(result).toBe(0);
  });
});
