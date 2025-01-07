import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoForms', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  describe('getResponses', () => {
    test('successfully retrieves form responses', async () => {
      const mockResponses = {
        data: [
          {
            id: 'response-1',
            type: EntityType.EVENTS,
            attributes: {
              uuid: 'uuid-123',
              data: {
                browser: {
                  height: '900',
                  user_agent: 'Mozilla/5.0',
                  width: '1440'
                },
                date: '2024-01-07T00:00:00Z',
                details: {
                  formField1: 'value1',
                  formField2: 'value2'
                },
                fields: {
                  name: 'John Doe',
                  email: 'john@example.com'
                },
                id: 'form-123',
                identity: {
                  email: 'john@example.com'
                },
                ip: '192.168.1.1',
                location: {
                  city_name: 'San Francisco',
                  continent_code: 'NA',
                  country_code2: 'US',
                  country_code3: 'USA',
                  country_name: 'United States',
                  ip: '192.168.1.1',
                  latitude: 37.7749,
                  longitude: -122.4194,
                  postal_code: '94105',
                  real_region_name: 'California',
                  region_name: 'CA',
                  request: '192.168.1.1'
                },
                page: {
                  host: 'example.com',
                  path: '/contact',
                  protocol: 'https',
                  referrer: 'https://google.com',
                  url: 'https://example.com/contact'
                },
                site: 'site-123',
                type: 'form_submission',
                visit: 'visit-123',
                visitor: 'visitor-123'
              }
            }
          }
        ]
      };

      setupMockFetch(mockResponses);

      const result = await analytics.V1.Forms.getResponses('form-123');

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result?.[0].attributes.data.fields.name).toBe('John Doe');
      expect(result?.[0].attributes.data.identity.email).toBe('john@example.com');
    });

    test('successfully handles multiple form responses', async () => {
      const mockResponses = {
        data: [
          {
            id: 'response-1',
            type: EntityType.EVENTS,
            attributes: {
              uuid: 'uuid-123',
              data: {
                browser: {
                  height: '900',
                  user_agent: 'Mozilla/5.0',
                  width: '1440'
                },
                date: '2024-01-07T00:00:00Z',
                details: { form: 'details1' },
                fields: { name: 'John Doe' },
                id: 'form-123',
                identity: { email: 'john@example.com' },
                ip: '192.168.1.1',
                location: {
                  city_name: '',
                  continent_code: '',
                  country_code2: '',
                  country_code3: '',
                  country_name: 'United States',
                  ip: '192.168.1.1',
                  latitude: 0,
                  longitude: 0,
                  postal_code: '',
                  real_region_name: '',
                  region_name: '',
                  request: '192.168.1.1'
                },
                page: {
                  host: 'example.com',
                  path: '/form1',
                  protocol: 'https',
                  referrer: '',
                  url: 'https://example.com/form1'
                },
                site: 'site-123',
                type: 'form_submission',
                visit: 'visit-123',
                visitor: 'visitor-123'
              }
            }
          },
          {
            id: 'response-2',
            type: EntityType.EVENTS,
            attributes: {
              uuid: 'uuid-124',
              data: {
                browser: {
                  height: '800',
                  user_agent: 'Mozilla/5.0',
                  width: '1280'
                },
                date: '2024-01-07T00:00:00Z',
                details: { form: 'details2' },
                fields: { name: 'Jane Doe' },
                id: 'form-123',
                identity: { email: 'jane@example.com' },
                ip: '192.168.1.2',
                location: {
                  city_name: '',
                  continent_code: '',
                  country_code2: '',
                  country_code3: '',
                  country_name: 'United States',
                  ip: '192.168.1.2',
                  latitude: 0,
                  longitude: 0,
                  postal_code: '',
                  real_region_name: '',
                  region_name: '',
                  request: '192.168.1.2'
                },
                page: {
                  host: 'example.com',
                  path: '/form2',
                  protocol: 'https',
                  referrer: '',
                  url: 'https://example.com/form2'
                },
                site: 'site-123',
                type: 'form_submission',
                visit: 'visit-124',
                visitor: 'visitor-124'
              }
            }
          }
        ]
      };

      setupMockFetch(mockResponses);

      const result = await analytics.V1.Forms.getResponses('form-123');

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result?.[0].attributes.data.fields.name).toBe('John Doe');
      expect(result?.[1].attributes.data.fields.name).toBe('Jane Doe');
    });

    test('returns null when response is empty', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Forms.getResponses('form-123');

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      expect(analytics.V1.Forms.getResponses('form-123')).rejects.toThrow();
    });

    test('handles form response with minimal data', async () => {
      const mockMinimalResponse = {
        data: [
          {
            id: 'response-1',
            type: EntityType.EVENTS,
            attributes: {
              uuid: 'uuid-123',
              data: {
                browser: {
                  height: '',
                  user_agent: '',
                  width: ''
                },
                date: '2024-01-07T00:00:00Z',
                details: {},
                fields: {},
                id: 'form-123',
                identity: { email: '' },
                ip: '',
                location: {
                  city_name: '',
                  continent_code: '',
                  country_code2: '',
                  country_code3: '',
                  country_name: '',
                  ip: '',
                  latitude: 0,
                  longitude: 0,
                  postal_code: '',
                  real_region_name: '',
                  region_name: '',
                  request: ''
                },
                page: {
                  host: '',
                  path: '',
                  protocol: '',
                  referrer: '',
                  url: ''
                },
                site: '',
                type: 'form_submission',
                visit: '',
                visitor: ''
              }
            }
          }
        ]
      };

      setupMockFetch(mockMinimalResponse);

      const result = await analytics.V1.Forms.getResponses('form-123');

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result?.[0].attributes.data.type).toBe('form_submission');
    });
  });
});