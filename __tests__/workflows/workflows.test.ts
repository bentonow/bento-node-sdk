import { expect, test, describe, beforeEach, afterEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch, lastFetchUrl, lastFetchMethod, resetMockFetchTracking } from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoWorkflows', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });
  afterEach(() => {
    resetMockFetchTracking();
  });

  describe('getWorkflows', () => {
    test('successfully retrieves workflows with email templates', async () => {
      const mockWorkflows = {
        data: [
          {
            id: 'wf-1',
            type: EntityType.WORKFLOWS,
            attributes: {
              name: 'Welcome Workflow',
              created_at: '2024-01-01T00:00:00Z',
              email_templates: [
                { id: 1, subject: 'Welcome!', stats: { opened: 150, clicked: 75 } },
                { id: 2, subject: 'Next Steps', stats: { opened: 120, clicked: 60 } },
              ],
            },
          },
          {
            id: 'wf-2',
            type: EntityType.WORKFLOWS,
            attributes: {
              name: 'Abandoned Cart Workflow',
              created_at: '2024-02-01T00:00:00Z',
              email_templates: [{ id: 3, subject: 'You left something behind', stats: null }],
            },
          },
        ],
      };

      setupMockFetch(mockWorkflows);

      const result = await analytics.V1.Workflows.getWorkflows();

      expect(result).toHaveLength(2);
      expect(result[0].attributes.name).toBe('Welcome Workflow');
      expect(result[0].attributes.email_templates).toHaveLength(2);
      expect(result[1].attributes.name).toBe('Abandoned Cart Workflow');
    });

    test('uses correct endpoint for GET request', async () => {
      setupMockFetch({ data: [] });

      await analytics.V1.Workflows.getWorkflows();

      expect(lastFetchUrl).toContain('/fetch/workflows');
      expect(lastFetchMethod).toBe('GET');
    });

    test('returns empty array when response is empty object', async () => {
      setupMockFetch({});

      const result = await analytics.V1.Workflows.getWorkflows();

      expect(result).toEqual([]);
    });

    test('returns empty array when response has no data', async () => {
      setupMockFetch({ data: null });

      const result = await analytics.V1.Workflows.getWorkflows();

      expect(result).toEqual([]);
    });

    test('returns empty array when no workflows exist', async () => {
      setupMockFetch({ data: [] });

      const result = await analytics.V1.Workflows.getWorkflows();

      expect(result).toHaveLength(0);
    });

    test('handles workflow with empty email templates', async () => {
      const mockWorkflows = {
        data: [
          {
            id: 'wf-1',
            type: EntityType.WORKFLOWS,
            attributes: {
              name: 'Empty Workflow',
              created_at: '2024-01-01T00:00:00Z',
              email_templates: [],
            },
          },
        ],
      };

      setupMockFetch(mockWorkflows);

      const result = await analytics.V1.Workflows.getWorkflows();

      expect(result[0].attributes.email_templates).toHaveLength(0);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(analytics.V1.Workflows.getWorkflows()).rejects.toThrow();
    });

    test('handles 401 unauthorized error', async () => {
      setupMockFetch({ error: 'Unauthorized' }, 401);

      await expect(analytics.V1.Workflows.getWorkflows()).rejects.toThrow();
    });

    test('handles 429 rate limited error', async () => {
      setupMockFetch({ error: 'Rate Limited' }, 429);

      await expect(analytics.V1.Workflows.getWorkflows()).rejects.toThrow();
    });
  });
});
