import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../../src';
import { mockOptions } from '../../helpers/mockClient';
import { setupMockFetch } from '../../helpers/mockFetch';
import { EntityType } from '../../../src/sdk/enums';

describe('BentoAPIV1 - upsertSubscriber', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully creates new subscriber', async () => {
    // Mock the import response
    setupMockFetch({ results: 1 });

    // Mock the get subscriber response for a new subscriber
    const mockSubscriber = {
      data: {
        id: 'new-sub-1',
        type: EntityType.VISITORS,
        attributes: {
          uuid: 'uuid-123',
          email: 'new@example.com',
          fields: {
            firstName: 'John',
            lastName: 'Doe',
          },
          cached_tag_ids: [],
          unsubscribed_at: null,
        },
      },
    };

    // Setup the second fetch call to return the subscriber
    setupMockFetch(mockSubscriber);

    const result = await analytics.V1.upsertSubscriber({
      email: 'new@example.com',
      fields: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe('new@example.com');
    expect(result?.attributes.fields?.firstName).toBe('John');
  });

  test('successfully updates existing subscriber', async () => {
    // Mock the import response
    setupMockFetch({ results: 1 });

    // Mock the get subscriber response for an existing subscriber
    const mockSubscriber = {
      data: {
        id: 'existing-sub-1',
        type: EntityType.VISITORS,
        attributes: {
          uuid: 'uuid-456',
          email: 'existing@example.com',
          fields: {
            firstName: 'Jane',
            lastName: 'Smith',
            company: 'Updated Corp',
          },
          cached_tag_ids: ['existing-tag'],
          unsubscribed_at: null,
        },
      },
    };

    // Setup the second fetch call to return the updated subscriber
    setupMockFetch(mockSubscriber);

    const result = await analytics.V1.upsertSubscriber({
      email: 'existing@example.com',
      fields: {
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'Updated Corp',
      },
    });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe('existing@example.com');
    expect(result?.attributes.fields?.company).toBe('Updated Corp');
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

  test('handles error during subscriber fetch', async () => {
    // First call succeeds (import)
    setupMockFetch({ results: 1 });

    // Second call fails (get subscriber)
    setupMockFetch({ error: 'Fetch failed' }, 500);

    await expect(
      analytics.V1.upsertSubscriber({
        email: 'test@example.com',
        fields: {
          firstName: 'Test',
        },
      })
    ).rejects.toThrow();
  });

  test('handles subscriber not found after import', async () => {
    // First call succeeds (import)
    setupMockFetch({ results: 1 });

    // Second call returns null subscriber
    setupMockFetch({ data: null });

    const result = await analytics.V1.upsertSubscriber({
      email: 'test@example.com',
      fields: {
        firstName: 'Test',
      },
    });

    expect(result).toBeNull();
  });

  test('successfully upserts with tags', async () => {
    setupMockFetch({ results: 1 });

    const mockSubscriber = {
      data: {
        id: 'sub-tagged',
        type: EntityType.VISITORS,
        attributes: {
          uuid: 'uuid-tagged',
          email: 'tagged@example.com',
          fields: {
            firstName: 'Tagged',
          },
          cached_tag_ids: ['tag-1', 'tag-2'],
          unsubscribed_at: null,
        },
      },
    };

    setupMockFetch(mockSubscriber);

    const result = await analytics.V1.upsertSubscriber({
      email: 'tagged@example.com',
      fields: {
        firstName: 'Tagged',
      },
      tags: 'tag-1,tag-2',
    });

    expect(result?.attributes.cached_tag_ids).toContain('tag-1');
    expect(result?.attributes.cached_tag_ids).toContain('tag-2');
  });

  test('successfully upserts with remove_tags', async () => {
    setupMockFetch({ results: 1 });

    const mockSubscriber = {
      data: {
        id: 'sub-removed-tags',
        type: EntityType.VISITORS,
        attributes: {
          uuid: 'uuid-removed',
          email: 'removed-tags@example.com',
          fields: {
            firstName: 'Removed',
          },
          cached_tag_ids: [],
          unsubscribed_at: null,
        },
      },
    };

    setupMockFetch(mockSubscriber);

    const result = await analytics.V1.upsertSubscriber({
      email: 'removed-tags@example.com',
      fields: {
        firstName: 'Removed',
      },
      remove_tags: 'old-tag',
    });

    expect(result?.attributes.cached_tag_ids).toHaveLength(0);
  });

  test('successfully upserts with both tags and remove_tags', async () => {
    setupMockFetch({ results: 1 });

    const mockSubscriber = {
      data: {
        id: 'sub-both-tags',
        type: EntityType.VISITORS,
        attributes: {
          uuid: 'uuid-both',
          email: 'both-tags@example.com',
          fields: {
            firstName: 'Both',
          },
          cached_tag_ids: ['new-tag'],
          unsubscribed_at: null,
        },
      },
    };

    setupMockFetch(mockSubscriber);

    const result = await analytics.V1.upsertSubscriber({
      email: 'both-tags@example.com',
      fields: {
        firstName: 'Both',
      },
      tags: 'new-tag',
      remove_tags: 'old-tag',
    });

    expect(result?.attributes.cached_tag_ids).toContain('new-tag');
  });
});
