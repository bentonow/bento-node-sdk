import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoFields', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  describe('getFields', () => {
    test('successfully retrieves fields', async () => {
      const mockFields = {
        data: [
          {
            id: 'field-1',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'firstName',
              name: 'First Name',
              created_at: '2024-01-01T00:00:00Z',
              whitelisted: true
            }
          },
          {
            id: 'field-2',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'companyName',
              name: 'Company Name',
              created_at: '2024-01-02T00:00:00Z',
              whitelisted: true
            }
          }
        ]
      };

      setupMockFetch(mockFields);

      const result = await analytics.V1.Fields.getFields();

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result?.[0].attributes.key).toBe('firstName');
      expect(result?.[0].attributes.name).toBe('First Name');
      expect(result?.[1].attributes.key).toBe('companyName');
      expect(result?.[1].attributes.name).toBe('Company Name');
    });

    test('returns null when response is empty', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Fields.getFields();

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      expect(analytics.V1.Fields.getFields()).rejects.toThrow();
    });
  });

  describe('createField', () => {
    test('successfully creates a field with camelCase key', async () => {
      const mockResponse = {
        data: [
          {
            id: 'new-field-1',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'userLocation',
              name: 'User Location',
              created_at: '2024-01-07T00:00:00Z',
              whitelisted: true
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Fields.createField({
        key: 'userLocation'
      });

      expect(result).toBeDefined();
      expect(result?.[0].attributes.key).toBe('userLocation');
      expect(result?.[0].attributes.name).toBe('User Location');
    });

    test('successfully creates a field with snake_case key', async () => {
      const mockResponse = {
        data: [
          {
            id: 'new-field-2',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'user_status',
              name: 'User Status',
              created_at: '2024-01-07T00:00:00Z',
              whitelisted: true
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Fields.createField({
        key: 'user_status'
      });

      expect(result).toBeDefined();
      expect(result?.[0].attributes.key).toBe('user_status');
      expect(result?.[0].attributes.name).toBe('User Status');
    });

    test('successfully creates a field with kebab-case key', async () => {
      const mockResponse = {
        data: [
          {
            id: 'new-field-3',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'last-login-date',
              name: 'Last Login Date',
              created_at: '2024-01-07T00:00:00Z',
              whitelisted: true
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Fields.createField({
        key: 'last-login-date'
      });

      expect(result).toBeDefined();
      expect(result?.[0].attributes.key).toBe('last-login-date');
      expect(result?.[0].attributes.name).toBe('Last Login Date');
    });

    test('returns null when response is empty', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Fields.createField({
        key: 'testField'
      });

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      expect(
        analytics.V1.Fields.createField({
          key: 'testField',
        })
      ).rejects.toThrow();
    });

    test('creates field with special characters in key', async () => {
      const mockResponse = {
        data: [
          {
            id: 'special-field-1',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'field_123!@#',
              name: 'Field 123!@#',
              created_at: '2024-01-07T00:00:00Z',
              whitelisted: true
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Fields.createField({
        key: 'field_123!@#'
      });

      expect(result).toBeDefined();
      expect(result?.[0].attributes.key).toBe('field_123!@#');
    });

    test('creates multiple fields in one response', async () => {
      const mockResponse = {
        data: [
          {
            id: 'field-1',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'field1',
              name: 'Field 1',
              created_at: '2024-01-07T00:00:00Z',
              whitelisted: true
            }
          },
          {
            id: 'field-2',
            type: EntityType.VISITORS_FIELDS,
            attributes: {
              key: 'field2',
              name: 'Field 2',
              created_at: '2024-01-07T00:00:00Z',
              whitelisted: true
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Fields.createField({
        key: 'multipleFields'
      });

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result?.[0].attributes.key).toBe('field1');
      expect(result?.[1].attributes.key).toBe('field2');
    });
  });
});