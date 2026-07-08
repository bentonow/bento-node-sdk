import { expect, test, describe, beforeEach, afterEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import {
  setupMockFetch,
  lastFetchUrl,
  lastFetchMethod,
  lastFetchBody,
  resetMockFetchTracking,
} from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoSequences', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });
  afterEach(() => {
    resetMockFetchTracking();
  });

  describe('getSequences', () => {
    test('successfully retrieves sequences with email templates', async () => {
      const mockSequences = {
        data: [
          {
            id: 'seq-1',
            type: EntityType.SEQUENCES,
            attributes: {
              name: 'Onboarding Sequence',
              created_at: '2024-01-01T00:00:00Z',
              email_templates: [
                { id: 1, subject: 'Welcome Email', stats: { opened: 100, clicked: 50 } },
                { id: 2, subject: 'Getting Started', stats: { opened: 80, clicked: 40 } },
              ],
            },
          },
          {
            id: 'seq-2',
            type: EntityType.SEQUENCES,
            attributes: {
              name: 'Re-engagement Sequence',
              created_at: '2024-02-01T00:00:00Z',
              email_templates: [{ id: 3, subject: 'We Miss You', stats: null }],
            },
          },
        ],
      };

      setupMockFetch(mockSequences);

      const result = await analytics.V1.Sequences.getSequences();

      expect(result).toHaveLength(2);
      expect(result[0].attributes.name).toBe('Onboarding Sequence');
      expect(result[0].attributes.email_templates).toHaveLength(2);
      expect(result[1].attributes.name).toBe('Re-engagement Sequence');
    });

    test('uses correct endpoint for GET request', async () => {
      setupMockFetch({ data: [] });

      await analytics.V1.Sequences.getSequences();

      expect(lastFetchUrl).toContain('/fetch/sequences');
      expect(lastFetchMethod).toBe('GET');
    });

    test('passes pagination parameters in query string', async () => {
      setupMockFetch({ data: [] });

      await analytics.V1.Sequences.getSequences({ page: 5 });

      expect(lastFetchUrl).toContain('/fetch/sequences');
      const url = new URL(lastFetchUrl!);
      expect(url.searchParams.get('page')).toBe('5');
      expect(url.searchParams.get('site_uuid')).toBe(mockOptions.siteUuid);
    });

    test('returns empty array when response is empty object', async () => {
      setupMockFetch({});

      const result = await analytics.V1.Sequences.getSequences();

      expect(result).toEqual([]);
    });

    test('returns empty array when response has no data', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Sequences.getSequences();

      expect(result).toEqual([]);
    });

    test('returns empty array when no sequences exist', async () => {
      setupMockFetch({ data: [] });

      const result = await analytics.V1.Sequences.getSequences();

      expect(result).toHaveLength(0);
    });

    test('handles sequence with empty email templates', async () => {
      const mockSequences = {
        data: [
          {
            id: 'seq-1',
            type: EntityType.SEQUENCES,
            attributes: {
              name: 'Empty Sequence',
              created_at: '2024-01-01T00:00:00Z',
              email_templates: [],
            },
          },
        ],
      };

      setupMockFetch(mockSequences);

      const result = await analytics.V1.Sequences.getSequences();

      expect(result[0].attributes.email_templates).toHaveLength(0);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(analytics.V1.Sequences.getSequences()).rejects.toThrow();
    });

    test('handles 401 unauthorized error', async () => {
      setupMockFetch({ error: 'Unauthorized' }, 401);

      await expect(analytics.V1.Sequences.getSequences()).rejects.toThrow();
    });
  });

  describe('createSequenceEmail', () => {
    test('successfully creates a sequence email template', async () => {
      const mockTemplate = {
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {
            name: 'Welcome Sequence Email',
            subject: 'Welcome aboard',
            html: '<h1>Hello there</h1>',
            created_at: '2024-01-01T00:00:00Z',
            stats: null,
          },
        },
      };

      setupMockFetch(mockTemplate, 201);

      const result = await analytics.V1.Sequences.createSequenceEmail('123', {
        subject: 'Welcome aboard',
        html: '<h1>Hello there</h1>',
        delay_interval: 'days',
        delay_interval_count: 7,
      });

      expect(result).not.toBeNull();
      expect(result!.attributes.subject).toBe('Welcome aboard');
      expect(result!.attributes.html).toBe('<h1>Hello there</h1>');
    });

    test('uses correct endpoint for POST request', async () => {
      setupMockFetch({
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {},
        },
      });

      await analytics.V1.Sequences.createSequenceEmail('789', {
        subject: 'Test Subject',
        html: '<p>Test</p>',
      });

      expect(lastFetchUrl).toContain('/fetch/sequences/789/emails/templates');
      expect(lastFetchMethod).toBe('POST');
    });

    test('wraps the payload and site_uuid in the POST body', async () => {
      setupMockFetch({
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {},
        },
      });

      await analytics.V1.Sequences.createSequenceEmail('789', {
        subject: 'Test Subject',
        html: '<p>Test</p>',
        delay_interval: 'days',
        delay_interval_count: 7,
        inbox_snippet: 'Start here',
      });

      expect(JSON.parse(String(lastFetchBody))).toEqual({
        site_uuid: mockOptions.siteUuid,
        email_template: {
          subject: 'Test Subject',
          html: '<p>Test</p>',
          delay_interval: 'days',
          delay_interval_count: 7,
          inbox_snippet: 'Start here',
        },
      });
    });

    test('rejects blank IDs before sending a request', async () => {
      setupMockFetch({
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {},
        },
      });

      await expect(
        analytics.V1.Sequences.createSequenceEmail('   ', {
          subject: 'Test Subject',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('Sequence ID must be the non-empty id returned by list sequences');
      expect(lastFetchUrl).toBeNull();
    });

    test('normalizes the sequence ID in the POST path', async () => {
      setupMockFetch({
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {},
        },
      });

      await analytics.V1.Sequences.createSequenceEmail('  123  ', {
        subject: 'Test Subject',
        html: '<p>Test</p>',
      });

      expect(lastFetchUrl).toContain('/fetch/sequences/123/emails/templates');
    });

    test('returns null when response is empty object', async () => {
      setupMockFetch({}, 201);

      const result = await analytics.V1.Sequences.createSequenceEmail('123', {
        subject: 'Test Subject',
        html: '<p>Test</p>',
      });

      expect(result).toBeNull();
    });

    test('returns null when response has no data', async () => {
      setupMockFetch({ data: null }, 201);

      const result = await analytics.V1.Sequences.createSequenceEmail('123', {
        subject: 'Test Subject',
        html: '<p>Test</p>',
      });

      expect(result).toBeNull();
    });

    test('handles validation errors', async () => {
      setupMockFetch(
        {
          errors: {
            delay_interval_count: ['must be a positive integer'],
          },
        },
        422
      );

      await expect(
        analytics.V1.Sequences.createSequenceEmail('123', {
          subject: 'Test Subject',
          html: '<p>Test</p>',
          delay_interval: 'days',
          delay_interval_count: 0,
        })
      ).rejects.toThrow();
    });

    test('surfaces not found errors for valid missing sequence IDs', async () => {
      setupMockFetch({ error: 'Sequence not found' }, 404);

      await expect(
        analytics.V1.Sequences.createSequenceEmail('404', {
          subject: 'Test Subject',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('[404]');
    });
  });
});
