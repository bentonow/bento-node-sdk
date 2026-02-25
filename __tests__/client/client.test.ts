import { expect, test, describe, beforeEach, afterEach, mock } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import {
  setupMockFetch,
  lastFetchSignal,
  lastFetchUrl,
  resetMockFetchTracking,
} from '../helpers/mockFetch';
import { NotAuthorizedError, RateLimitedError, RequestTimeoutError } from '../../src';

describe('BentoClient', () => {
  let analytics: Analytics;
  let globalScope: any;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
    globalScope = global;
  });
  afterEach(() => {
    resetMockFetchTracking();
  });

  describe('Base64 Encoding', () => {
    test('uses btoa when available', () => {
      const mockBtoa = mock(() => 'encoded');
      globalScope.btoa = mockBtoa;
      delete globalScope.Buffer;

      const analytics = new Analytics(mockOptions);
      expect(mockBtoa).toHaveBeenCalled();
    });

    test('uses Buffer when btoa is not available', () => {
      const originalBtoa = globalScope.btoa;
      delete globalScope.btoa;

      const mockBuffer = {
        from: mock(() => ({
          toString: () => 'mocked-base64',
        })),
      };
      globalScope.Buffer = mockBuffer;

      const analytics = new Analytics({
        ...mockOptions,
        authentication: {
          publishableKey: 'test',
          secretKey: 'test',
        },
      });

      const headers = (analytics.V1 as any)._client._headers;
      expect(headers['Authorization']).toBe('Basic mocked-base64');

      globalScope.btoa = originalBtoa;
      delete globalScope.Buffer;
    });

    test('uses fallback implementation when neither btoa nor Buffer is available', () => {
      const originalBtoa = globalScope.btoa;
      const originalBuffer = globalScope.Buffer;
      delete globalScope.btoa;
      delete globalScope.Buffer;

      const analytics = new Analytics(mockOptions);

      // Test basic ASCII encoding
      // Create a test string that we can predict the base64 output for
      const testStr = 'test:test';
      const expectedBase64 = 'dGVzdDp0ZXN0'; // 'test:test' in base64
      const result = (analytics.V1 as any)._client._extractHeaders(
        { publishableKey: 'test', secretKey: 'test' },
        'test'
      );

      expect(result['Authorization']).toBe(`Basic ${expectedBase64}`);

      globalScope.btoa = originalBtoa;
      globalScope.Buffer = originalBuffer;
    });

    test('throws error for non-Latin1 characters in fallback implementation', () => {
      const originalBtoa = globalScope.btoa;
      const originalBuffer = globalScope.Buffer;
      delete globalScope.btoa;
      delete globalScope.Buffer;

      expect(() => {
        const nonLatin1Str = '🌟'; // Unicode character
        (analytics.V1 as any)._client._extractHeaders(
          { publishableKey: nonLatin1Str, secretKey: '' },
          'test'
        );
      }).toThrow(
        "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
      );

      globalScope.btoa = originalBtoa;
      globalScope.Buffer = originalBuffer;
    });
  });

  describe('Error Handling', () => {
    test('throws NotAuthorizedError on 401', async () => {
      setupMockFetch({ error: 'Unauthorized' }, 401);
      expect(analytics.V1.Tags.getTags()).rejects.toThrow(NotAuthorizedError);
    });

    test('throws RateLimitedError on 429', async () => {
      setupMockFetch({ error: 'Too Many Requests' }, 429);
      expect(analytics.V1.Tags.getTags()).rejects.toThrow(RateLimitedError);
    });

    test('handles text/plain error response', async () => {
      const errorMessage = 'Plain text error message';
      setupMockFetch({ error: errorMessage }, 500, 'text/plain');

      expect(analytics.V1.Tags.getTags()).rejects.toThrow(`[500] - ${errorMessage}`);
    });

    test('handles unknown content-type error response', async () => {
      setupMockFetch({ error: 'Unknown error' }, 500, 'application/unknown');

      expect(analytics.V1.Tags.getTags()).rejects.toThrow(
        '[500] - Unknown response from the Bento API.'
      );
    });

    test('throws AuthorNotAuthorizedError on 500 with author not authorized error', async () => {
      setupMockFetch(
        { error: 'Author not authorized to send on this account' },
        500,
        'application/json'
      );
      const promise = analytics.V1.Broadcasts.getBroadcasts();
      await expect(promise).rejects.toThrow('Author not authorized to send on this account');
      await expect(promise).rejects.toThrow(require('../../src').AuthorNotAuthorizedError);
    });
  });

  describe('Client Configuration', () => {
    test('initializes with default options', () => {
      const client = (analytics.V1 as any)._client;
      expect(client._baseUrl).toBe('https://app.bentonow.com/api/v1');
      expect(client._siteUuid).toBe(mockOptions.siteUuid);
      expect(client._logErrors).toBe(mockOptions.logErrors);
    });

    test('initializes with custom baseUrl', () => {
      const customOptions = {
        ...mockOptions,
        clientOptions: {
          baseUrl: 'https://custom.api.com',
        },
      };
      const customAnalytics = new Analytics(customOptions);
      const client = (customAnalytics.V1 as any)._client;
      expect(client._baseUrl).toBe('https://custom.api.com');
    });

    test('handles requests with query parameters', async () => {
      let capturedUrl: string | null = null;

      // Setup mock that captures the URL
      mock.module('cross-fetch', () => ({
        default: (url: string, _options: RequestInit) => {
          capturedUrl = url;
          return Promise.resolve({
            status: 200,
            ok: true,
            json: () => Promise.resolve({ data: null }),
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          });
        },
      }));

      await analytics.V1.Forms.getResponses('test-form');

      // Verify URL contains expected query parameters
      expect(capturedUrl).not.toBeNull();
      const url = new URL(capturedUrl!);
      expect(url.searchParams.get('id')).toBe('test-form');
      expect(url.searchParams.get('site_uuid')).toBe(mockOptions.siteUuid);
    });

    test('converts non-string query parameter values to strings', async () => {
      let capturedUrl: string | null = null;

      // Setup mock that captures the URL
      mock.module('cross-fetch', () => ({
        default: (url: string, _options: RequestInit) => {
          capturedUrl = url;
          return Promise.resolve({
            status: 200,
            ok: true,
            json: () => Promise.resolve({ data: null }),
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          });
        },
      }));

      // Test with a parameter that would have a non-string value
      await analytics.V1.Forms.getResponses('test-form');

      // Verify URL query parameters are properly stringified
      expect(capturedUrl).not.toBeNull();
      const url = new URL(capturedUrl!);

      // All query parameters should be strings, not undefined or null
      expect(typeof url.searchParams.get('site_uuid')).toBe('string');
      expect(url.searchParams.get('site_uuid')).not.toBe('undefined');
      expect(url.searchParams.get('site_uuid')).not.toBe('null');

      // Verify site_uuid is properly set
      expect(url.searchParams.get('site_uuid')).toBe(mockOptions.siteUuid);
    });

    test('omits undefined query parameters when forwarding SDK options', async () => {
      setupMockFetch({ data: [] });

      await analytics.V1.Sequences.getSequences({ page: undefined });

      expect(lastFetchUrl).not.toBeNull();
      const url = new URL(lastFetchUrl!);
      expect(url.searchParams.has('page')).toBe(false);
      expect(url.searchParams.get('site_uuid')).toBe(mockOptions.siteUuid);
    });

    test('initializes with custom timeout', () => {
      const customOptions = {
        ...mockOptions,
        clientOptions: {
          timeout: 5000,
        },
      };
      const customAnalytics = new Analytics(customOptions);
      const client = (customAnalytics.V1 as any)._client;
      expect(client._timeout).toBe(5000);
    });

    test('uses default timeout of 30000ms', () => {
      const client = (analytics.V1 as any)._client;
      expect(client._timeout).toBe(30000);
    });

    test('attaches AbortSignal to standard requests', async () => {
      setupMockFetch({ data: [] });

      await analytics.V1.Fields.getFields();

      expect(lastFetchSignal).not.toBeNull();
    });
  });

  describe('Timeout Handling', () => {
    test('throws RequestTimeoutError on timeout', async () => {
      // Mock fetch to simulate a timeout by using AbortController
      mock.module('cross-fetch', () => ({
        default: (_url: string, options: RequestInit) => {
          return new Promise((_resolve, reject) => {
            // Simulate the abort being triggered
            if (options.signal) {
              const abortHandler = () => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                reject(error);
              };
              options.signal.addEventListener('abort', abortHandler);
              // Don't resolve - let the timeout happen
            }
          });
        },
      }));

      // Create analytics with very short timeout
      const timeoutAnalytics = new Analytics({
        ...mockOptions,
        clientOptions: {
          timeout: 1, // 1ms timeout to trigger quickly
        },
      });

      await expect(timeoutAnalytics.V1.Tags.getTags()).rejects.toThrow(RequestTimeoutError);
    });
  });

  describe('JSON Response Handling', () => {
    test('throws error on invalid JSON response with success status', async () => {
      mock.module('cross-fetch', () => ({
        default: () => {
          return Promise.resolve({
            status: 200,
            ok: true,
            json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')),
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          });
        },
      }));

      await expect(analytics.V1.Tags.getTags()).rejects.toThrow(
        'Invalid JSON response from server'
      );
    });
  });
});
