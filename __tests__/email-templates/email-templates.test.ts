import { expect, test, describe, beforeEach, afterEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch, lastFetchUrl, lastFetchMethod, resetMockFetchTracking } from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoEmailTemplates', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });
  afterEach(() => {
    resetMockFetchTracking();
  });

  describe('getEmailTemplate', () => {
    test('successfully retrieves an email template by ID', async () => {
      const mockTemplate = {
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {
            name: 'Welcome Email',
            subject: 'Welcome to our service!',
            html: '<h1>Welcome!</h1><p>Thank you for signing up.</p>',
            created_at: '2024-01-01T00:00:00Z',
            stats: { opened: 100, clicked: 50 },
          },
        },
      };

      setupMockFetch(mockTemplate);

      const result = await analytics.V1.EmailTemplates.getEmailTemplate({ id: 123 });

      expect(result).not.toBeNull();
      expect(result!.id).toBe('123');
      expect(result!.attributes.name).toBe('Welcome Email');
      expect(result!.attributes.subject).toBe('Welcome to our service!');
      expect(result!.attributes.html).toBe('<h1>Welcome!</h1><p>Thank you for signing up.</p>');
    });

    test('uses correct endpoint for GET request', async () => {
      setupMockFetch({ data: { id: '123', type: EntityType.EMAIL_TEMPLATES, attributes: {} } });

      await analytics.V1.EmailTemplates.getEmailTemplate({ id: 456 });

      expect(lastFetchUrl).toContain('/fetch/emails/templates/456');
      expect(lastFetchMethod).toBe('GET');
    });

    test('returns null when response is empty object', async () => {
      setupMockFetch({});

      const result = await analytics.V1.EmailTemplates.getEmailTemplate({ id: 999 });

      expect(result).toBeNull();
    });

    test('returns null when response has no data', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.EmailTemplates.getEmailTemplate({ id: 999 });

      expect(result).toBeNull();
    });

    test('returns template with null stats', async () => {
      const mockTemplate = {
        data: {
          id: '789',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {
            name: 'No Stats Template',
            subject: 'Test Subject',
            html: '<p>Test</p>',
            created_at: '2024-01-01T00:00:00Z',
            stats: null,
          },
        },
      };

      setupMockFetch(mockTemplate);

      const result = await analytics.V1.EmailTemplates.getEmailTemplate({ id: 789 });

      expect(result).not.toBeNull();
      expect(result!.attributes.stats).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(analytics.V1.EmailTemplates.getEmailTemplate({ id: 123 })).rejects.toThrow();
    });
  });

  describe('updateEmailTemplate', () => {
    test('successfully updates email template subject', async () => {
      const mockUpdatedTemplate = {
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {
            name: 'Welcome Email',
            subject: 'New Subject Line',
            html: '<h1>Welcome!</h1>',
            created_at: '2024-01-01T00:00:00Z',
            stats: null,
          },
        },
      };

      setupMockFetch(mockUpdatedTemplate);

      const result = await analytics.V1.EmailTemplates.updateEmailTemplate({
        id: 123,
        subject: 'New Subject Line',
      });

      expect(result).not.toBeNull();
      expect(result!.attributes.subject).toBe('New Subject Line');
    });

    test('successfully updates email template HTML', async () => {
      const mockUpdatedTemplate = {
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {
            name: 'Welcome Email',
            subject: 'Welcome!',
            html: '<h1>Updated Content</h1>',
            created_at: '2024-01-01T00:00:00Z',
            stats: null,
          },
        },
      };

      setupMockFetch(mockUpdatedTemplate);

      const result = await analytics.V1.EmailTemplates.updateEmailTemplate({
        id: 123,
        html: '<h1>Updated Content</h1>',
      });

      expect(result).not.toBeNull();
      expect(result!.attributes.html).toBe('<h1>Updated Content</h1>');
    });

    test('successfully updates both subject and HTML', async () => {
      const mockUpdatedTemplate = {
        data: {
          id: '123',
          type: EntityType.EMAIL_TEMPLATES,
          attributes: {
            name: 'Welcome Email',
            subject: 'Brand New Subject',
            html: '<p>Brand New HTML</p>',
            created_at: '2024-01-01T00:00:00Z',
            stats: { opened: 200 },
          },
        },
      };

      setupMockFetch(mockUpdatedTemplate);

      const result = await analytics.V1.EmailTemplates.updateEmailTemplate({
        id: 123,
        subject: 'Brand New Subject',
        html: '<p>Brand New HTML</p>',
      });

      expect(result).not.toBeNull();
      expect(result!.attributes.subject).toBe('Brand New Subject');
      expect(result!.attributes.html).toBe('<p>Brand New HTML</p>');
    });

    test('uses correct endpoint for PATCH request', async () => {
      setupMockFetch({ data: { id: '123', type: EntityType.EMAIL_TEMPLATES, attributes: {} } });

      await analytics.V1.EmailTemplates.updateEmailTemplate({
        id: 456,
        subject: 'Test Subject',
      });

      expect(lastFetchUrl).toContain('/fetch/emails/templates/456');
      expect(lastFetchMethod).toBe('PATCH');
    });

    test('returns null when response is empty object', async () => {
      setupMockFetch({});

      const result = await analytics.V1.EmailTemplates.updateEmailTemplate({
        id: 999,
        subject: 'Test',
      });

      expect(result).toBeNull();
    });

    test('returns null when response has no data', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.EmailTemplates.updateEmailTemplate({
        id: 999,
        html: '<p>Test</p>',
      });

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.EmailTemplates.updateEmailTemplate({
          id: 123,
          subject: 'Test',
        })
      ).rejects.toThrow();
    });

    test('handles 404 not found error', async () => {
      setupMockFetch({ error: 'Not Found' }, 404);

      await expect(
        analytics.V1.EmailTemplates.updateEmailTemplate({
          id: 999999,
          subject: 'Test',
        })
      ).rejects.toThrow();
    });
  });
});
