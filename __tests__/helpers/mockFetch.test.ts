import { expect, test, describe } from 'bun:test';
import { getEndpointFromUrl, setupMockFetch } from './mockFetch';

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

  describe('setupMockFetch text handling', () => {
    test('returns raw string for text/plain body', async () => {
      setupMockFetch('plain text', 200, 'text/plain');
      const fetchModule = await import('cross-fetch');
      const response = await fetchModule.default('https://app.bentonow.com/api/v1/test');
      const text = await response.text();
      expect(text).toBe('plain text');
    });

    test('returns error field when provided', async () => {
      setupMockFetch({ error: 'Server Error' }, 500, 'text/plain');
      const fetchModule = await import('cross-fetch');
      const response = await fetchModule.default('https://app.bentonow.com/api/v1/test');
      const text = await response.text();
      expect(text).toBe('Server Error');
    });

    test('stringifies non-string text bodies without error', async () => {
      setupMockFetch({ value: 123 }, 200, 'text/plain');
      const fetchModule = await import('cross-fetch');
      const response = await fetchModule.default('https://app.bentonow.com/api/v1/test');
      const text = await response.text();
      expect(text).toBe('[object Object]');
    });

    test('uses queued responses and falls back to last entry', async () => {
      setupMockFetch([
        { body: { value: 'first' } },
        { body: { value: 'second' } },
      ]);
      const fetchModule = await import('cross-fetch');
      const fetchFn = fetchModule.default;

      const first = await fetchFn('https://app.bentonow.com/api/v1/test');
      const second = await fetchFn('https://app.bentonow.com/api/v1/test');
      const third = await fetchFn('https://app.bentonow.com/api/v1/test');

      expect(await first.json()).toEqual({ value: 'first' });
      expect(await second.json()).toEqual({ value: 'second' });
      expect(await third.json()).toEqual({ value: 'second' });
    });
  });
});
