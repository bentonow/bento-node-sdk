import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';
import { EntityType } from '../../src/sdk/enums';

describe('BentoBroadcasts', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  describe('createEmails', () => {
    test('successfully creates single email', async () => {
      setupMockFetch({ results: 1 });

      const result = await analytics.V1.Broadcasts.createEmails([{
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Test Email',
        html_body: '<p>Hello {{ name }}</p>',
        transactional: true,
        personalizations: {
          name: 'John Doe'
        }
      }]);

      expect(result).toBe(1);
    });

    test('successfully creates multiple emails', async () => {
      setupMockFetch({ results: 2 });

      const result = await analytics.V1.Broadcasts.createEmails([
        {
          to: 'recipient1@example.com',
          from: 'sender@example.com',
          subject: 'Test Email 1',
          html_body: '<p>Hello</p>',
          transactional: true
        },
        {
          to: 'recipient2@example.com',
          from: 'sender@example.com',
          subject: 'Test Email 2',
          html_body: '<p>World</p>',
          transactional: true
        }
      ]);

      expect(result).toBe(2);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Broadcasts.createEmails([{
          to: 'recipient@example.com',
          from: 'sender@example.com',
          subject: 'Test',
          html_body: '<p>Test</p>',
          transactional: true
        }])
      ).rejects.toThrow();
    });
  });

  describe('getBroadcasts', () => {
    test('successfully retrieves broadcasts', async () => {
      const mockBroadcasts = {
        data: [
          {
            id: 'broadcast-1',
            type: EntityType.EVENTS,
            attributes: {
              name: 'Test Broadcast',
              subject: 'Test Subject',
              content: '<p>Test Content</p>',
              type: 'html',
              from: {
                name: 'Sender Name',
                email: 'sender@example.com'
              },
              batch_size_per_hour: 100,
              created_at: '2024-01-01T00:00:00Z'
            }
          }
        ]
      };

      setupMockFetch(mockBroadcasts);

      const result = await analytics.V1.Broadcasts.getBroadcasts();

      expect(result).toHaveLength(1);
      // @ts-ignore
      expect(result[0].attributes.name).toBe('Test Broadcast');
      // @ts-ignore
      expect(result[0].attributes.type).toBe('html');
    });

    test('returns empty array when no broadcasts exist', async () => {
      setupMockFetch({ data: [] });

      const result = await analytics.V1.Broadcasts.getBroadcasts();

      expect(result).toHaveLength(0);
    });
  });

  describe('createBroadcast', () => {
    test('successfully creates broadcast', async () => {
      const mockResponse = {
        data: [
          {
            id: 'new-broadcast-1',
            type: EntityType.EVENTS,
            attributes: {
              name: 'New Broadcast',
              subject: 'New Subject',
              content: '<p>Content</p>',
              type: 'html',
              from: {
                name: 'Sender',
                email: 'sender@example.com'
              },
              batch_size_per_hour: 100,
              created_at: '2024-01-01T00:00:00Z'
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Broadcasts.createBroadcast([{
        name: 'New Broadcast',
        subject: 'New Subject',
        content: '<p>Content</p>',
        type: 'html',
        from: {
          name: 'Sender',
          email: 'sender@example.com'
        },
        batch_size_per_hour: 100
      }]);

      expect(result).toHaveLength(1);
      // @ts-ignore
      expect(result[0].attributes.name).toBe('New Broadcast');
    });

    test('handles broadcast with segments and tags', async () => {
      const mockResponse = {
        data: [
          {
            id: 'broadcast-2',
            type: EntityType.EVENTS,
            attributes: {
              name: 'Segmented Broadcast',
              subject: 'For Segment',
              content: 'Content',
              type: 'plain',
              from: {
                name: 'Sender',
                email: 'sender@example.com'
              },
              inclusive_tags: 'tag1,tag2',
              exclusive_tags: 'tag3',
              segment_id: 'segment-123',
              batch_size_per_hour: 50,
              created_at: '2024-01-01T00:00:00Z'
            }
          }
        ]
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Broadcasts.createBroadcast([{
        name: 'Segmented Broadcast',
        subject: 'For Segment',
        content: 'Content',
        type: 'plain',
        from: {
          name: 'Sender',
          email: 'sender@example.com'
        },
        inclusive_tags: 'tag1,tag2',
        exclusive_tags: 'tag3',
        segment_id: 'segment-123',
        batch_size_per_hour: 50
      }]);

      expect(result).toHaveLength(1);
      // @ts-ignore
      expect(result[0].attributes.segment_id).toBe('segment-123');
      // @ts-ignore
      expect(result[0].attributes.inclusive_tags).toBe('tag1,tag2');
    });
  });
});