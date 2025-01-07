import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoTags', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  describe('getTags', () => {
    test('successfully retrieves tags', async () => {
      const mockTags = {
        data: [
          {
            id: 'tag-1',
            type: EntityType.TAGS,
            attributes: {
              name: 'VIP',
              created_at: '2024-01-01T00:00:00Z',
              discarded_at: null,
              site_id: 123
            }
          },
          {
            id: 'tag-2',
            type: EntityType.TAGS,
            attributes: {
              name: 'Newsletter',
              created_at: '2024-01-02T00:00:00Z',
              discarded_at: null,
              site_id: 123
            }
          }
        ]
      };

      setupMockFetch(mockTags);

      const result = await analytics.V1.Tags.getTags();

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result?.[0].attributes.name).toBe('VIP');
      expect(result?.[1].attributes.name).toBe('Newsletter');
    });

    test('returns null when response is empty', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Tags.getTags();

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Tags.getTags()
      ).rejects.toThrow();
    });
  });

  describe('createTag', () => {
    test('successfully creates a tag', async () => {
      const mockResponse = {
        data: [
          {
            id: 'new-tag-1',
            type: EntityType.TAGS,
            attributes: {
              name: 'New Tag',
              created_at: '2024-01-07T00:00:00Z',
              discarded_at: null,
              site_id: 123
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Tags.createTag({
        name: 'New Tag'
      });

      expect(result).toBeDefined();
      expect(result?.[0].attributes.name).toBe('New Tag');
      expect(result?.[0].attributes.discarded_at).toBeNull();
    });

    test('returns null when response is empty', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Tags.createTag({
        name: 'Test Tag'
      });

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      expect(
        analytics.V1.Tags.createTag({
          name: 'Test Tag',
        })
      ).rejects.toThrow();
    });

    test('creates tag with special characters', async () => {
      const mockResponse = {
        data: [
          {
            id: 'special-tag-1',
            type: EntityType.TAGS,
            attributes: {
              name: 'Special-Tag!@#',
              created_at: '2024-01-07T00:00:00Z',
              discarded_at: null,
              site_id: 123
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Tags.createTag({
        name: 'Special-Tag!@#'
      });

      expect(result).toBeDefined();
      expect(result?.[0].attributes.name).toBe('Special-Tag!@#');
    });

    test('creates tag with non-ascii characters', async () => {
      const mockResponse = {
        data: [
          {
            id: 'unicode-tag-1',
            type: EntityType.TAGS,
            attributes: {
              name: '🏷️タグ',
              created_at: '2024-01-07T00:00:00Z',
              discarded_at: null,
              site_id: 123
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Tags.createTag({
        name: '🏷️タグ'
      });

      expect(result).toBeDefined();
      expect(result?.[0].attributes.name).toBe('🏷️タグ');
    });

    test('creates multiple tags in one response', async () => {
      const mockResponse = {
        data: [
          {
            id: 'tag-1',
            type: EntityType.TAGS,
            attributes: {
              name: 'Tag 1',
              created_at: '2024-01-07T00:00:00Z',
              discarded_at: null,
              site_id: 123
            }
          },
          {
            id: 'tag-2',
            type: EntityType.TAGS,
            attributes: {
              name: 'Tag 2',
              created_at: '2024-01-07T00:00:00Z',
              discarded_at: null,
              site_id: 123
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Tags.createTag({
        name: 'Multiple Tags'
      });

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result?.[0].attributes.name).toBe('Tag 1');
      expect(result?.[1].attributes.name).toBe('Tag 2');
    });
  });
});