import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions, mockSuccessResponse } from '../helpers/mockClient';
import { mock } from 'bun:test';

describe('BentoCommands - addTag', () => {
  let analytics: Analytics;

  beforeEach(() => {
    console.log('\nStarting new test...');

    // Use Bun's mock API to mock cross-fetch
    mock.module('cross-fetch', () => ({
      default: (url: string, options: RequestInit) => {
        console.log('Mocked cross-fetch called');
        console.log('URL:', url);
        console.log('Headers:', options.headers);
        console.log('Body:', options.body);

        return Promise.resolve({
          status: 200,
          ok: true,
          json: () => Promise.resolve(mockSuccessResponse),
          text: () => Promise.resolve(JSON.stringify(mockSuccessResponse)),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        });
      }
    }));

    analytics = new Analytics(mockOptions);
  });

  test('successfully adds a tag to a subscriber', async () => {
    const result = await analytics.V1.Commands.addTag({
      email: 'test@example.com',
      tagName: 'TestTag'
    });

    expect(result).toBeDefined();
    expect(result?.attributes.email).toBe('test@example.com');
    expect(result?.attributes.cached_tag_ids).toContain('tag-123');
  });
});