import { mock } from 'bun:test';

type MockResponseEntry = {
  body: any;
  status?: number;
  contentType?: string;
};

const normalizeEntry = (
  value: MockResponseEntry | any,
  defaultStatus: number,
  defaultContentType: string
): MockResponseEntry => {
  if (value && typeof value === 'object' && 'body' in value) {
    return {
      body: value.body,
      status: value.status ?? defaultStatus,
      contentType: value.contentType ?? defaultContentType,
    };
  }

  return {
    body: value,
    status: defaultStatus,
    contentType: defaultContentType,
  };
};

// Store the last URL, method, and signal for verification in tests
export let lastFetchUrl: string | null = null;
export let lastFetchMethod: string | null = null;
export let lastFetchSignal: AbortSignal | null = null;

export const setupMockFetch = (
  response: any | MockResponseEntry[],
  status = 200,
  contentType = 'application/json'
) => {
  lastFetchUrl = null;
  lastFetchMethod = null;
  lastFetchSignal = null;

  const isQueue = Array.isArray(response);
  const queue = isQueue
    ? (response as MockResponseEntry[]).map((entry) => normalizeEntry(entry, 200, 'application/json'))
    : null;
  const singleEntry = normalizeEntry(response, status, contentType);
  const fallbackEntry = queue && queue.length > 0 ? queue[queue.length - 1] : singleEntry;

  mock.module('cross-fetch', () => ({
    default: (url: string, options: RequestInit = {}) => {
      // Capture URL, method, and AbortSignal for test verification
      lastFetchUrl = url;
      lastFetchMethod = options.method || 'GET';
      lastFetchSignal = options.signal ?? null;

      const entry = queue ? queue.shift() ?? fallbackEntry : singleEntry;
      const currentStatus = entry.status ?? status;
      const currentContentType = entry.contentType ?? contentType;
      const body = entry.body;

      return Promise.resolve({
        status: currentStatus,
        ok: currentStatus >= 200 && currentStatus < 300,
        json: () => Promise.resolve(body),
        text: () => {
          if (currentContentType === 'text/plain') {
            if (typeof body === 'string') {
              return Promise.resolve(body);
            }
            if (body?.error) {
              return Promise.resolve(body.error);
            }
            return Promise.resolve(String(body));
          }

          return Promise.resolve(JSON.stringify(body));
        },
        headers: new Headers({
          'Content-Type': currentContentType,
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
