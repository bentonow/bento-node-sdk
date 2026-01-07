import { mock } from 'bun:test';

// Store the last URL and method for verification in tests
export let lastFetchUrl: string | null = null;
export let lastFetchMethod: string | null = null;

export const setupMockFetch = (response: any, status = 200, contentType = 'application/json') => {
  mock.module('cross-fetch', () => ({
    default: (url: string, options: RequestInit) => {
      // Capture URL and method for test verification
      lastFetchUrl = url;
      lastFetchMethod = options?.method || 'GET';

      return Promise.resolve({
        status,
        ok: status >= 200 && status < 300,
        json: () => Promise.resolve(response),
        text: () => {
          if (contentType === 'text/plain') {
            return Promise.resolve(response.error);
          }
          return Promise.resolve(JSON.stringify(response));
        },
        headers: new Headers({
          'Content-Type': contentType,
        }),
      });
    },
  }));
};

/**
 * Helper function to extract the endpoint from a full URL
 * e.g., "https://app.bentonow.com/api/v1/fetch/broadcasts" => "/fetch/broadcasts"
 */
export const getEndpointFromUrl = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/\/api\/v1(.+?)(\?|$)/);
  return match ? match[1] : null;
};
