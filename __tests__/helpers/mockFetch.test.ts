import { expect, test, describe } from 'bun:test';
import { getEndpointFromUrl } from './mockFetch';

describe('mockFetch helpers', () => {
  describe('getEndpointFromUrl', () => {
    test('extracts endpoint from full URL', () => {
      const url = 'https://app.bentonow.com/api/v1/fetch/broadcasts';
      const endpoint = getEndpointFromUrl(url);
      expect(endpoint).toBe('/fetch/broadcasts');
    });

    test('extracts endpoint with query parameters', () => {
      const url = 'https://app.bentonow.com/api/v1/fetch/subscribers?site_uuid=123&email=test@example.com';
      const endpoint = getEndpointFromUrl(url);
      expect(endpoint).toBe('/fetch/subscribers');
    });

    test('handles batch endpoints', () => {
      const url = 'https://app.bentonow.com/api/v1/batch/events';
      const endpoint = getEndpointFromUrl(url);
      expect(endpoint).toBe('/batch/events');
    });

    test('returns null for empty URL', () => {
      const endpoint = getEndpointFromUrl('');
      expect(endpoint).toBeNull();
    });

    test('returns null for URLs without /api/v1', () => {
      const url = 'https://example.com/some/path';
      const endpoint = getEndpointFromUrl(url);
      expect(endpoint).toBeNull();
    });

    test('extracts endpoint from experimental endpoint', () => {
      const url = 'https://app.bentonow.com/api/v1/experimental/validation';
      const endpoint = getEndpointFromUrl(url);
      expect(endpoint).toBe('/experimental/validation');
    });
  });
});
