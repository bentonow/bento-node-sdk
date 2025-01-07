import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { mockSubscriberResponse } from '../helpers/mockResponses';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoCommands - removeField', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully removes a field from a subscriber', async () => {
    const email = 'test@example.com';
    setupMockFetch(mockSubscriberResponse(email));

    const result = await analytics.V1.Commands.removeField({
      email,
      fieldName: 'testField'
    });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe(email);
  });

  test('returns null when response is empty', async () => {
    setupMockFetch({ data: null });

    const result = await analytics.V1.Commands.removeField({
      email: 'test@example.com',
      fieldName: 'testField'
    });

    expect(result).toBeNull();
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Commands.removeField({
        email: 'test@example.com',
        fieldName: 'testField',
      })
    ).rejects.toThrow();
  });
});