import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch, lastFetchSignal } from '../helpers/mockFetch';
import { BentoEvents } from '../../src/sdk/batch/enums';
describe('BentoBatch - importEvents', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully imports purchase event', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.PURCHASE,
        email: 'test@example.com',
        details: {
          unique: {
            key: '123'
          },
          value: {
            currency: 'USD',
            amount: 99.99
          },
          cart: {
            items: [{
              product_id: 'prod_123',
              product_name: 'Test Product',
              product_price: 99.99,
              quantity: 1
            }]
          }
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports subscribe event', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.SUBSCRIBE,
        email: 'test@example.com',
        fields: {
          name: 'Test User'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports tag event', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.TAG,
        email: 'test@example.com',
        details: {
          tag: 'VIP'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports remove tag event', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.REMOVE_TAG,
        email: 'test@example.com',
        details: {
          tag: 'VIP'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports unsubscribe event', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.UNSUBSCRIBE,
        email: 'test@example.com'
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports update fields event', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.UPDATE_FIELDS,
        email: 'test@example.com',
        fields: {
          name: 'Updated Name',
          company: 'Updated Company'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports multiple events', async () => {
    setupMockFetch({ results: 2 });

    const result = await analytics.V1.Batch.importEvents({
      events: [
        {
          type: BentoEvents.TAG,
          email: 'test1@example.com',
          details: {
            tag: 'VIP'
          }
        },
        {
          type: BentoEvents.SUBSCRIBE,
          email: 'test2@example.com',
          fields: {
            name: 'Test User'
          }
        }
      ]
    });

    expect(result).toBe(2);
  });

  test('throws error when no events provided', async () => {
    setupMockFetch({ results: 0 });

    expect(
      analytics.V1.Batch.importEvents({
        events: [],
      })
    ).rejects.toThrow('You must send between 1 and 1,000 events.');
  });

  test('throws error when too many events provided', async () => {
    // Create array of 1001 events
    const tooManyEvents = Array.from({ length: 1001 }, () => ({
      type: BentoEvents.TAG,
      email: 'test@example.com',
      details: {
        tag: 'VIP'
      }
    }));

    expect(
      analytics.V1.Batch.importEvents({
        events: tooManyEvents,
      })
    ).rejects.toThrow('You must send between 1 and 1,000 events.');
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Batch.importEvents({
        events: [
          {
            type: BentoEvents.TAG,
            email: 'test@example.com',
            details: {
              tag: 'VIP',
            },
          },
        ],
      })
    ).rejects.toThrow();
  });

  test('handles custom event type', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: '$custom_event' as any,
        email: 'test@example.com',
        details: {
          customField: 'custom value'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('handles events with date field', async () => {
    setupMockFetch({ results: 1 });
    const eventDate = new Date();

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.TAG,
        email: 'test@example.com',
        date: eventDate,
        details: {
          tag: 'VIP'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports update fields event with all field types', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.UPDATE_FIELDS,
        email: 'test@example.com',
        fields: {
          stringField: 'string',
          numberField: 123,
          booleanField: true,
          dateField: new Date(),
          nullField: null,
          arrayField: ['a', 'b', 'c'],
          objectField: { key: 'value' }
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully imports purchase event with all optional fields', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.PURCHASE,
        email: 'test@example.com',
        date: new Date('2024-01-07'),
        details: {
          unique: {
            key: '123'
          },
          value: {
            currency: 'USD',
            amount: 99.99
          },
          cart: {
            abandoned_checkout_url: 'https://example.com/cart',
            items: [{
              product_id: 'prod_123',
              product_name: 'Test Product',
              product_price: 99.99,
              quantity: 1,
              product_sku: 'SKU123',
              custom_field: 'custom value'
            }]
          }
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('handles array of different event types', async () => {
    setupMockFetch({ results: 3 });

    const result = await analytics.V1.Batch.importEvents({
      events: [
        {
          type: BentoEvents.TAG,
          email: 'test1@example.com',
          details: {
            tag: 'VIP'
          }
        },
        {
          type: BentoEvents.PURCHASE,
          email: 'test2@example.com',
          details: {
            unique: { key: '123' },
            value: { currency: 'USD', amount: 99.99 }
          }
        },
        {
          type: BentoEvents.UPDATE_FIELDS,
          email: 'test3@example.com',
          fields: {
            name: 'Test User'
          }
        }
      ]
    });

    expect(result).toBe(3);
  });

  test('uses unlimited timeout for imports', async () => {
    setupMockFetch({ results: 1 });

    await analytics.V1.Batch.importEvents({
      events: [{
        type: BentoEvents.TAG,
        email: 'signal@example.com',
        details: {
          tag: 'VIP'
        }
      }]
    });

    expect(lastFetchSignal).toBeNull();
  });
});
