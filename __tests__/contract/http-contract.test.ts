import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { Analytics, bentoEndpointContracts } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import {
  getEndpointFromUrl,
  lastFetchBody,
  lastFetchHeaders,
  lastFetchMethod,
  lastFetchUrl,
  resetMockFetchTracking,
  setupMockFetch,
} from '../helpers/mockFetch';

function headerValue(headers: HeadersInit | undefined, name: string): string | undefined {
  if (!headers) return undefined;

  if (headers instanceof Headers) {
    return headers.get(name) ?? undefined;
  }

  if (Array.isArray(headers)) {
    const match = headers.find(([key]) => key.toLowerCase() === name.toLowerCase());
    return match?.[1];
  }

  const record = headers as Record<string, string>;
  return record[name] ?? record[name.toLowerCase()];
}

describe('Bento endpoint contract', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  afterEach(() => {
    resetMockFetchTracking();
  });

  test('contains the sequence email create contract', () => {
    expect(bentoEndpointContracts).toContainEqual({
      domain: 'sequences',
      operation: 'createSequenceEmail',
      method: 'POST',
      path: '/fetch/sequences/:sequenceId/emails/templates',
      siteUuid: 'body',
      auth: {
        authorization: 'basic',
        userAgentPrefix: 'bento-node-',
      },
      bodyWrapper: 'email_template',
      successStatuses: [200, 201],
    });
  });

  test('SDK createSequenceEmail matches the published contract', async () => {
    setupMockFetch({
      data: {
        id: '123',
        type: 'email_template',
        attributes: {},
      },
    });

    await analytics.V1.Sequences.createSequenceEmail('123', {
      subject: 'Contract subject',
      html: '<p>Contract body</p>',
    });

    const contract = bentoEndpointContracts.find(
      (endpoint) => endpoint.operation === 'createSequenceEmail'
    );
    const body = JSON.parse(String(lastFetchBody));

    expect(contract).toBeDefined();
    expect(lastFetchMethod).toBe(contract?.method);
    expect(getEndpointFromUrl(lastFetchUrl ?? '')).toBe(
      contract?.path.replace(':sequenceId', '123')
    );
    expect(body.site_uuid).toBe(mockOptions.siteUuid);
    expect(body.email_template).toEqual({
      subject: 'Contract subject',
      html: '<p>Contract body</p>',
    });
    expect(headerValue(lastFetchHeaders, 'Authorization')).toMatch(/^Basic /);
    expect(headerValue(lastFetchHeaders, 'User-Agent')).toBe(
      `${contract?.auth.userAgentPrefix}${mockOptions.siteUuid}`
    );
  });

  test('SDK listSequences matches the published contract', async () => {
    setupMockFetch({ data: [] });

    await analytics.V1.Sequences.getSequences({ page: 2 });

    const contract = bentoEndpointContracts.find(
      (endpoint) => endpoint.operation === 'listSequences'
    );
    const url = new URL(lastFetchUrl ?? '');

    expect(contract).toBeDefined();
    expect(lastFetchMethod).toBe(contract?.method);
    expect(getEndpointFromUrl(lastFetchUrl ?? '')).toBe(contract?.path);
    expect(url.searchParams.get('site_uuid')).toBe(mockOptions.siteUuid);
    expect(url.searchParams.get('page')).toBe('2');
    expect(headerValue(lastFetchHeaders, 'Authorization')).toMatch(/^Basic /);
    expect(headerValue(lastFetchHeaders, 'User-Agent')).toBe(
      `${contract?.auth.userAgentPrefix}${mockOptions.siteUuid}`
    );
  });
});
