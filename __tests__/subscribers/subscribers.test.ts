import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoSubscribers', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  describe('getSubscribers', () => {
    test('successfully retrieves subscriber by email', async () => {
      const mockSubscriber = {
        data: {
          id: 'sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'uuid-123',
            email: 'test@example.com',
            fields: {
              firstName: 'Test',
              lastName: 'User'
            },
            cached_tag_ids: ['tag-1', 'tag-2'],
            unsubscribed_at: null
          }
        }
      };

      setupMockFetch(mockSubscriber);

      const result = await analytics.V1.Subscribers.getSubscribers({
        email: 'test@example.com'
      });

      expect(result).toBeDefined();
      expect(result?.attributes.email).toBe('test@example.com');
      expect(result?.attributes.fields).toEqual({
        firstName: 'Test',
        lastName: 'User'
      });
      expect(result?.attributes.cached_tag_ids).toEqual(['tag-1', 'tag-2']);
    });

    test('successfully retrieves subscriber by uuid', async () => {
      const mockSubscriber = {
        data: {
          id: 'sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'uuid-123',
            email: 'test@example.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: null
          }
        }
      };

      setupMockFetch(mockSubscriber);

      const result = await analytics.V1.Subscribers.getSubscribers({
        uuid: 'uuid-123'
      });

      expect(result).toBeDefined();
      expect(result?.attributes.uuid).toBe('uuid-123');
    });

    test('returns null when response is empty', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Subscribers.getSubscribers({
        email: 'test@example.com'
      });

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Subscribers.getSubscribers({
          email: 'test@example.com'
        })
      ).rejects.toThrow();
    });

    test('handles unsubscribed subscriber', async () => {
      const mockSubscriber = {
        data: {
          id: 'sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'uuid-123',
            email: 'test@example.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: '2024-01-07T00:00:00Z'
          }
        }
      };

      setupMockFetch(mockSubscriber);

      const result = await analytics.V1.Subscribers.getSubscribers({
        email: 'test@example.com'
      });

      expect(result).toBeDefined();
      expect(result?.attributes.unsubscribed_at).toBe('2024-01-07T00:00:00Z');
    });
  });

  describe('createSubscriber', () => {
    test('successfully creates a subscriber', async () => {
      const mockResponse = {
        data: {
          id: 'new-sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'new-uuid-123',
            email: 'new@example.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: null
          }
        }
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Subscribers.createSubscriber({
        email: 'new@example.com'
      });

      expect(result).toBeDefined();
      expect(result?.attributes.email).toBe('new@example.com');
      expect(result?.attributes.unsubscribed_at).toBeNull();
    });

    test('returns null when response is empty', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Subscribers.createSubscriber({
        email: 'test@example.com'
      });

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Subscribers.createSubscriber({
          email: 'test@example.com'
        })
      ).rejects.toThrow();
    });

    test('creates subscriber with unicode email', async () => {
      const mockResponse = {
        data: {
          id: 'unicode-sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'unicode-uuid-123',
            email: 'test@例子.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: null
          }
        }
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Subscribers.createSubscriber({
        email: 'test@例子.com'
      });

      expect(result).toBeDefined();
      expect(result?.attributes.email).toBe('test@例子.com');
    });

    test('handles plus addressing in email', async () => {
      const mockResponse = {
        data: {
          id: 'plus-sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'plus-uuid-123',
            email: 'test+tag@example.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: null
          }
        }
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Subscribers.createSubscriber({
        email: 'test+tag@example.com'
      });

      expect(result).toBeDefined();
      expect(result?.attributes.email).toBe('test+tag@example.com');
    });
  });
});