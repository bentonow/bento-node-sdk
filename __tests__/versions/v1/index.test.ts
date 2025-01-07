import { expect, test, describe, beforeEach } from 'bun:test';
import { BentoAPIV1 } from '../../../src/versions/v1';
import { mockOptions } from '../../helpers/mockClient';
import { BentoBatch } from '../../../src/sdk';
import { BentoClient } from '../../../src/sdk';
import { BentoCommands } from '../../../src/sdk';
import { BentoExperimental } from '../../../src/sdk';
import { BentoFields } from '../../../src/sdk';
import { BentoForms } from '../../../src/sdk';
import { BentoSubscribers } from '../../../src/sdk';
import { BentoTags } from '../../../src/sdk';

describe('BentoAPIV1', () => {
  let api: BentoAPIV1;

  beforeEach(() => {
    api = new BentoAPIV1(mockOptions);
  });

  test('initializes all modules correctly', () => {
    expect(api.Batch).toBeInstanceOf(BentoBatch);
    expect(api.Commands).toBeInstanceOf(BentoCommands);
    expect(api.Experimental).toBeInstanceOf(BentoExperimental);
    expect(api.Fields).toBeInstanceOf(BentoFields);
    expect(api.Forms).toBeInstanceOf(BentoForms);
    expect(api.Subscribers).toBeInstanceOf(BentoSubscribers);
    expect(api.Tags).toBeInstanceOf(BentoTags);
  });

  test('shares same client instance across modules', () => {
    const client = (api as any)._client;
    expect(client).toBeInstanceOf(BentoClient);

    // Verify each module uses the same client instance
    expect((api.Batch as any)._client).toBe(client);
    expect((api.Commands as any)._client).toBe(client);
    expect((api.Experimental as any)._client).toBe(client);
    expect((api.Fields as any)._client).toBe(client);
    expect((api.Forms as any)._client).toBe(client);
    expect((api.Subscribers as any)._client).toBe(client);
    expect((api.Tags as any)._client).toBe(client);
  });

  test('initializes client with correct options', () => {
    const client = (api as any)._client;

    // Check if client was initialized with the correct options
    expect((client as any)._siteUuid).toBe(mockOptions.siteUuid);
    expect((client as any)._baseUrl).toBe(mockOptions.clientOptions?.baseUrl || 'https://app.bentonow.com/api/v1');
    expect((client as any)._logErrors).toBe(mockOptions.logErrors || false);
  });

  test('initializes with custom base URL', () => {
    const customOptions = {
      ...mockOptions,
      clientOptions: {
        baseUrl: 'https://custom.api.com'
      }
    };

    const customApi = new BentoAPIV1(customOptions);
    const client = (customApi as any)._client;

    expect((client as any)._baseUrl).toBe('https://custom.api.com');
  });

  test('initializes with log errors enabled', () => {
    const optionsWithLogging = {
      ...mockOptions,
      logErrors: true
    };

    const loggingApi = new BentoAPIV1(optionsWithLogging);
    const client = (loggingApi as any)._client;

    expect((client as any)._logErrors).toBe(true);
  });

  test('handles authentication options correctly', () => {
    const client = (api as any)._client;
    const headers = (client as any)._headers;

    // Check if authentication headers were set correctly
    expect(headers).toHaveProperty('Authorization');
    expect(headers.Authorization).toContain('Basic ');
    expect(headers['User-Agent']).toBe(`bento-node-${mockOptions.siteUuid}`);
  });

  test('maintains type generics across modules', () => {
    interface CustomFields {
      firstName: string;
      lastName: string;
      age: number;
    }

    type CustomEvents = 'custom_event' | 'another_event';

    const typedApi = new BentoAPIV1<CustomFields, CustomEvents>(mockOptions);

    // These lines will fail TypeScript compilation if generics aren't properly maintained
    expect(typedApi.Batch).toBeInstanceOf(BentoBatch);
    expect(typedApi.Commands).toBeInstanceOf(BentoCommands);
    expect(typedApi.Subscribers).toBeInstanceOf(BentoSubscribers);
  });
});