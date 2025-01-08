import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { TooFewSubscribersError, TooManySubscribersError } from '../../src/sdk/batch/errors';
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

      expect(
        analytics.V1.Subscribers.getSubscribers({
          email: 'test@example.com',
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

      expect(
        analytics.V1.Subscribers.createSubscriber({
          email: 'test@example.com',
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

  test('successfully imports single subscriber', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importSubscribers({
      subscribers: [{
        email: 'test@example.com'
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports multiple subscribers with fields', async () => {
    setupMockFetch({ results: 3 });

    const result = await analytics.V1.Batch.importSubscribers({
      subscribers: [
        {
          email: 'test1@example.com',
          firstName: 'Test1',
          custom: 'value1'
        },
        {
          email: 'test2@example.com',
          firstName: 'Test2',
          custom: 'value2'
        },
        {
          email: 'test3@example.com',
          firstName: 'Test3',
          custom: 'value3'
        }
      ]
    });

    expect(result).toBe(3);
  });

  test('throws TooFewSubscribersError when no subscribers provided', async () => {
    expect(
      analytics.V1.Batch.importSubscribers({
        subscribers: [],
      })
    ).rejects.toThrow(TooFewSubscribersError);
  });

  test('throws TooManySubscribersError when exceeding limit', async () => {
    // Create array of 1001 subscribers (exceeding 1000 limit)
    const tooManySubscribers = Array.from({ length: 1001 }, (_, i) => ({
      email: `test${i}@example.com`
    }));

    expect(
      analytics.V1.Batch.importSubscribers({
        subscribers: tooManySubscribers,
      })
    ).rejects.toThrow(TooManySubscribersError);
  });

  test('successfully imports subscribers at max limit', async () => {
    // Create array of 1000 subscribers (at limit)
    const maxSubscribers = Array.from({ length: 1000 }, (_, i) => ({
      email: `test${i}@example.com`
    }));

    setupMockFetch({ results: 1000 });

    const result = await analytics.V1.Batch.importSubscribers({
      subscribers: maxSubscribers
    });

    expect(result).toBe(1000);
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Batch.importSubscribers({
        subscribers: [
          {
            email: 'test@example.com',
          },
        ],
      })
    ).rejects.toThrow();
  });

  test('successfully imports subscribers with all field types', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importSubscribers({
      subscribers: [{
        email: 'test@example.com',
        stringField: 'string',
        numberField: 123,
        booleanField: true,
        dateField: new Date(),
        nullField: null,
        arrayField: ['a', 'b', 'c'],
        objectField: { key: 'value' }
      }]
    });

    expect(result).toBe(1);
  });
});