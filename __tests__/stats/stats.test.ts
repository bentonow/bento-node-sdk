import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoStats', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  describe('getSiteStats', () => {
    test('successfully retrieves site statistics', async () => {
      const mockStats = {
        total_subscribers: 1000,
        active_subscribers: 950,
        unsubscribed_count: 50,
        broadcast_count: 25,
        average_open_rate: 45.5,
        average_click_rate: 12.3
      };

      setupMockFetch(mockStats);

      const result = await analytics.V1.Stats.getSiteStats();

      expect(result.total_subscribers).toBe(1000);
      expect(result.active_subscribers).toBe(950);
      expect(result.average_open_rate).toBe(45.5);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Stats.getSiteStats()
      ).rejects.toThrow();
    });
  });

  describe('getSegmentStats', () => {
    test('successfully retrieves segment statistics', async () => {
      const mockStats = {
        segment_id: 'segment-123',
        subscriber_count: 500,
        growth_rate: 2.5,
        engagement_rate: 35.8,
        last_updated: '2024-01-01T00:00:00Z'
      };

      setupMockFetch(mockStats);

      const result = await analytics.V1.Stats.getSegmentStats('segment-123');

      expect(result.segment_id).toBe('segment-123');
      expect(result.subscriber_count).toBe(500);
      expect(result.growth_rate).toBe(2.5);
    });

    test('handles non-existent segment', async () => {
      setupMockFetch({ error: 'Segment not found' }, 404);

      await expect(
        analytics.V1.Stats.getSegmentStats('non-existent')
      ).rejects.toThrow();
    });
  });

  describe('getReportStats', () => {
    test('successfully retrieves report statistics', async () => {
      const mockStats = {
        report_id: 'report-123',
        total_sent: 1000,
        total_opens: 750,
        unique_opens: 500,
        total_clicks: 250,
        unique_clicks: 200,
        unsubscribes: 5,
        spam_reports: 1,
        created_at: '2024-01-01T00:00:00Z'
      };

      setupMockFetch(mockStats);

      const result = await analytics.V1.Stats.getReportStats('report-123');

      expect(result.report_id).toBe('report-123');
      expect(result.total_sent).toBe(1000);
      expect(result.unique_opens).toBe(500);
    });

    test('handles non-existent report', async () => {
      setupMockFetch({ error: 'Report not found' }, 404);

      await expect(
        analytics.V1.Stats.getReportStats('non-existent')
      ).rejects.toThrow();
    });
  });
});