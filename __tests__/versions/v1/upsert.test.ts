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

    setupMockFetch([
      { body: { results: 1 } },
      { body: mockSubscriber },
    ]);

    const result = await analytics.V1.upsertSubscriber({
      email: 'new@example.com',
      fields: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });

    expect(result).not.toBeNull();
    expect(result?.attributes.email).toBe('new@example.com');
    expect(result?.attributes.fields?.firstName).toBe('John');
  });

  test('successfully updates existing subscriber', async () => {
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

    setupMockFetch([
      { body: { results: 1 } },
      { body: mockSubscriber },
    ]);

    const result = await analytics.V1.upsertSubscriber({
      email: 'existing@example.com',
      fields: {
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'Updated Corp',
      },
    });

    expect(result).not.toBeNull();
    expect(result?.attributes.fields?.company).toBe('Updated Corp');
  });

  test('handles error during import', async () => {
    setupMockFetch([{ body: { error: 'Import failed' }, status: 500 }]);

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
    setupMockFetch([
      { body: { results: 1 } },
      { body: { error: 'Fetch failed' }, status: 500 },
    ]);

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
    setupMockFetch([
      { body: { results: 1 } },
      { body: { data: null } },
    ]);

    const result = await analytics.V1.upsertSubscriber({
      email: 'missing@example.com',
      fields: {
        firstName: 'Missing',
      },
    });

    expect(result).toBeNull();
  });
});
