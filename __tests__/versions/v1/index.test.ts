import { expect, test, describe, beforeEach } from 'bun:test';
import { BentoAPIV1 } from '../../../src/versions/v1';
import { mockOptions } from '../../helpers/mockClient';
import { setupMockFetch } from '../../helpers/mockFetch';
import { BentoEvents } from '../../../src/sdk/batch/enums';
import { EntityType } from '../../../src/sdk/enums';
import {
  BentoBatch,
  BentoClient,
  BentoCommands,
  BentoExperimental,
  BentoFields,
  BentoForms,
  BentoSubscribers,
  BentoTags,
} from '../../../src/sdk';

// Define interface for custom fields
interface CustomFields {
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

// Define type for custom events
type CustomEvents = '$custom' | '$pageview' | '$browser';

describe('BentoAPIV1', () => {
  let api: BentoAPIV1<CustomFields, CustomEvents>;

  beforeEach(() => {
    api = new BentoAPIV1<CustomFields, CustomEvents>(mockOptions);
  });

  test('initializes with correct options and modules', () => {
    // Test with default generic types
    const api = new BentoAPIV1(mockOptions);

    // Check if client is properly initialized
    const client = (api as any)._client;
    expect(client).toBeInstanceOf(BentoClient);
    expect(client._baseUrl).toBe('https://app.bentonow.com/api/v1');
    expect(client._siteUuid).toBe(mockOptions.siteUuid);
    expect(client._logErrors).toBe(mockOptions.logErrors);

    // Check if all modules are properly initialized with the same client instance
    expect(api.Batch).toBeInstanceOf(BentoBatch);
    expect((api.Batch as any)._client).toBe(client);

    expect(api.Commands).toBeInstanceOf(BentoCommands);
    expect((api.Commands as any)._client).toBe(client);

    expect(api.Experimental).toBeInstanceOf(BentoExperimental);
    expect((api.Experimental as any)._client).toBe(client);

    expect(api.Fields).toBeInstanceOf(BentoFields);
    expect((api.Fields as any)._client).toBe(client);

    expect(api.Forms).toBeInstanceOf(BentoForms);
    expect((api.Forms as any)._client).toBe(client);

    expect(api.Subscribers).toBeInstanceOf(BentoSubscribers);
    expect((api.Subscribers as any)._client).toBe(client);

    expect(api.Tags).toBeInstanceOf(BentoTags);
    expect((api.Tags as any)._client).toBe(client);
  });

  describe('initialization', () => {
    test('initializes with correct options and modules', () => {
      const client = (api as any)._client;
      expect(client._baseUrl).toBe('https://app.bentonow.com/api/v1');
      expect(client._siteUuid).toBe(mockOptions.siteUuid);
      expect(client._logErrors).toBe(mockOptions.logErrors);
    });

    test('initializes with custom client options', () => {
      const customOptions = {
        ...mockOptions,
        clientOptions: {
          baseUrl: 'https://custom.api.com',
        },
      };
      const customApi = new BentoAPIV1<CustomFields, CustomEvents>(customOptions);
      const client = (customApi as any)._client;
      expect(client._baseUrl).toBe('https://custom.api.com');
    });
  });

  // Track method tests
  describe('track methods', () => {
    test('successfully tracks an event', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        fields: {
          customField: 'value',
        },
        details: {
          someDetail: 'value',
        },
      });
    });
  });

  // Core functionality tests
  describe('core functionality', () => {
    test('successfully adds subscriber', async () => {
      const mockResponse = {
        data: {
          id: 'sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'uuid-123',
            email: 'test@example.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: null,
          },
        },
      };
      setupMockFetch(mockResponse);

      const result = await api.Commands.subscribe({ email: 'test@example.com' });
      expect(result?.attributes.email).toBe('test@example.com');
    });

    test('successfully removes subscriber', async () => {
      const mockResponse = {
        data: {
          id: 'sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'uuid-123',
            email: 'test@example.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: new Date().toISOString(),
          },
        },
      };
      setupMockFetch(mockResponse);

      const result = await api.Commands.unsubscribe({ email: 'test@example.com' });
      expect(result?.attributes.unsubscribed_at).not.toBeNull();
    });

    test('successfully tags subscriber', async () => {
      const mockResponse = {
        data: {
          id: 'sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'uuid-123',
            email: 'test@example.com',
            fields: null,
            cached_tag_ids: ['tag-1'],
            unsubscribed_at: null,
          },
        },
      };
      setupMockFetch(mockResponse);

      const result = await api.Commands.addTag({
        email: 'test@example.com',
        tagName: 'TestTag',
      });
      expect(result?.attributes.cached_tag_ids).toContain('tag-1');
    });

    test('successfully removes tag from subscriber', async () => {
      const mockResponse = {
        data: {
          id: 'sub-1',
          type: EntityType.VISITORS,
          attributes: {
            uuid: 'uuid-123',
            email: 'test@example.com',
            fields: null,
            cached_tag_ids: [],
            unsubscribed_at: null,
          },
        },
      };
      setupMockFetch(mockResponse);

      const result = await api.Commands.removeTag({
        email: 'test@example.com',
        tagName: 'TestTag',
      });
      expect(result?.attributes.cached_tag_ids).toHaveLength(0);
    });
  });

  // Field registration tests
  describe('field registration', () => {
    test('successfully registers fields', async () => {
      const mockResponse = {
        data: [
          {
            id: 'field-1',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'testField',
              name: 'Test Field',
              created_at: new Date().toISOString(),
              whitelisted: true,
            },
          },
        ],
      };
      setupMockFetch(mockResponse);

      const result = await api.Fields.createField({ key: 'testField' });
      expect(result?.[0]?.attributes.key).toBe('testField');
    });
  });

  // Initialization tests
  describe('initialization', () => {
    test('initializes with correct options', () => {
      const client = (api as any)._client;
      expect(client._baseUrl).toBe('https://app.bentonow.com/api/v1');
      expect(client._siteUuid).toBe(mockOptions.siteUuid);
      expect(client._logErrors).toBe(mockOptions.logErrors);
    });

    test('initializes with custom client options', () => {
      const customOptions = {
        ...mockOptions,
        clientOptions: {
          baseUrl: 'https://custom.api.com',
        },
      };
      const customApi = new BentoAPIV1<CustomFields, CustomEvents>(customOptions);
      const client = (customApi as any)._client;
      expect(client._baseUrl).toBe('https://custom.api.com');
    });
  });

  // Event tracking tests
  describe('event tracking', () => {
    test('successfully tracks custom event', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        fields: {
          firstName: 'John',
          lastName: 'Doe',
        },
        details: {
          someDetail: 'value',
        },
      });
    });

    test('successfully tracks batch events through Batch module', async () => {
      setupMockFetch({ results: 1 });

      const result = await api.Batch.importEvents({
        events: [
          {
            type: '$custom',
            email: 'test@example.com',
            details: {
              firstName: 'John',
            },
          },
        ],
      });

      expect(result).toBe(1);
    });

    test('successfully tracks pageview event', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$pageview',
        email: 'test@example.com',
        fields: {
          firstName: 'John',
        },
        details: {
          url: 'https://example.com',
          title: 'Test Page',
          referrer: 'https://google.com',
        },
      });
    });

    test('successfully tracks browser event', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$browser',
        email: 'test@example.com',
        fields: {
          firstName: 'John',
        },
        details: {
          userAgent: 'Mozilla/5.0',
          language: 'en-US',
          platform: 'MacOS',
        },
      });
    });

    test('successfully handles event with date field', async () => {
      setupMockFetch({ results: 1 });
      const eventDate = new Date('2024-01-08T12:00:00Z');

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        fields: {
          firstName: 'John',
        },
        details: {
          someDetail: 'value',
        },
        date: eventDate,
      });
    });
  });

    describe('track method variations', () => {
    test('tracks event with all possible fields', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        date: new Date(),
        fields: {
          firstName: 'John',
          lastName: 'Doe',
          customField: 'value',
        },
        details: {
          detailField: 'value',
          nestedDetail: {
            key: 'value',
          },
        },
      });
    });

    test('tracks event with minimal fields', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        fields: {},
      });
    });

    test('tracks event with invalid date', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        date: new Date('invalid date'), // Should trigger date validation
        fields: {},
      });
    });

    test('tracks event with future date', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        date: new Date('2025-12-31'),
        fields: {},
      });
    });

    test('tracks event with very old date', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        date: new Date('1970-01-01'),
        fields: {},
      });
    });
  });

  // Purchase Event Testing
  describe('purchase event tracking', () => {
    test('tracks purchase with all optional fields', async () => {
      setupMockFetch({ results: 1 });

      await api.Batch.importEvents({
        events: [
          {
            type: BentoEvents.PURCHASE,
            email: 'test@example.com',
            date: new Date(),
            details: {
              unique: {
                key: 'order_123',
              },
              value: {
                currency: 'USD',
                amount: 99.99,
              },
              cart: {
                abandoned_checkout_url: 'https://example.com/cart',
                items: [
                  {
                    product_id: 'prod_123',
                    product_name: 'Test Product',
                    product_sku: 'SKU123',
                    custom_field: 'custom value', // Added to show string indexer
                  },
                ],
              },
            },
          },
        ],
      });
    });

    test('tracks purchase with minimal required fields', async () => {
      setupMockFetch({ results: 1 });

      await api.Batch.importEvents({
        events: [
          {
            type: BentoEvents.PURCHASE,
            email: 'test@example.com',
            details: {
              unique: {
                key: 'order_123',
              },
              value: {
                currency: 'USD',
                amount: 99.99,
              },
            },
          },
        ],
      });
    });
  });

  // Edge Cases Testing
  describe('edge cases', () => {
    test('tracks event with empty details', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        fields: {},
        details: {},
      });
    });

    test('tracks event with complex nested details', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        fields: {},
        details: {
          level1: {
            level2: {
              level3: {
                value: 'deeply nested',
              },
            },
          },
        },
      });
    });

    test('tracks event with array values', async () => {
      setupMockFetch({ results: 1 });

      await api.track({
        type: '$custom',
        email: 'test@example.com',
        fields: {},
        details: {
          arrayField: ['value1', 'value2', 'value3'],
          mixedArray: [1, 'string', { key: 'value' }],
        },
      });
    });
  });

  // Batch Operations Testing
  describe('batch operations', () => {
    test('imports multiple events of different types', async () => {
      setupMockFetch({ results: 3 });

      await api.Batch.importEvents({
        events: [
          {
            type: '$custom',
            email: 'test1@example.com',
            details: {
              customField: 'value1',
            },
          },
          {
            type: '$pageview',
            email: 'test2@example.com',
            details: {
              url: 'https://example.com',
            },
          },
          {
            type: '$browser',
            email: 'test3@example.com',
            details: {
              userAgent: 'Mozilla/5.0',
            },
          },
        ],
      });
    });

    test('imports events with various date formats', async () => {
      setupMockFetch({ results: 3 });

      await api.Batch.importEvents({
        events: [
          {
            type: '$custom',
            email: 'test1@example.com',
            date: new Date(),
            details: {},
          },
          {
            type: '$custom',
            email: 'test2@example.com',
            date: new Date('2024-01-08T12:00:00Z'),
            details: {},
          },
          {
            type: '$custom',
            email: 'test3@example.com',
            date: new Date('2024-01-08'),
            details: {},
          },
        ],
      });
    });
  });

  // API V1 Helper Methods Testing
  describe('helper methods', () => {
    test('successfully tags subscriber through tagSubscriber method', async () => {
      setupMockFetch({ results: 1 });

      const result = await api.tagSubscriber({
        email: 'test@example.com',
        tagName: 'premium',
      });

      expect(result).toBe(true);
    });

    test('successfully removes subscriber through removeSubscriber method', async () => {
      setupMockFetch({ results: 1 });

      const result = await api.removeSubscriber({
        email: 'test@example.com',
      });

      expect(result).toBe(true);
    });

    test('successfully adds subscriber through addSubscriber method', async () => {
      setupMockFetch({ results: 1 });

      const result = await api.addSubscriber({
        email: 'new@example.com',
      });

      expect(result).toBe(true);
    });

    test('successfully updates fields through updateFields method', async () => {
      setupMockFetch({ results: 1 });

      const result = await api.updateFields({
        email: 'test@example.com',
        fields: {
          firstName: 'Updated',
          lastName: 'Name',
        },
      });

      expect(result).toBe(true);
    });

    test('successfully tracks purchase through trackPurchase method', async () => {
      setupMockFetch({ results: 1 });

      const result = await api.trackPurchase({
        email: 'test@example.com',
        purchaseDetails: {
          unique: { key: 'order-123' },
          value: { currency: 'USD', amount: 9999 },
        },
      });

      expect(result).toBe(true);
    });

    test('returns false when helper method fails', async () => {
      setupMockFetch({ results: 0 });

      const result = await api.tagSubscriber({
        email: 'test@example.com',
        tagName: 'premium',
      });

      expect(result).toBe(false);
    });
  });
});
