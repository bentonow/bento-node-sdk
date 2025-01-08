import { mock } from 'bun:test';

export const setupMockFetch = (response: any, status = 200, contentType = 'application/json') => {
  mock.module('cross-fetch', () => ({
    default: (_url: string, _options: RequestInit) => {
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
          'Content-Type': contentType
        })
      });
    }
  }));
};