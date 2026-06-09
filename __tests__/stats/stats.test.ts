import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { lastFetchUrl, setupMockFetch } from '../helpers/mockFetch';

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

  describe('getAdsStats', () => {
    test('successfully retrieves ads attribution statistics', async () => {
      const mockStats = {
        dimension: 'source',
        dimensionLabel: 'Source',
        attribution: {
          mode: 'last_click',
          modeLabel: 'Last Click',
          windowDays: 7,
          settingsPath: '/account/sites/123/attribution_settings',
          appliesToAdRevenue: false
        },
        revenueMode: {
          mode: 'all_revenue',
          label: 'All revenue',
          description: 'All revenue events'
        },
        totals: {
          signups: 42,
          customers: 8,
          revenueCents: 129900,
          revenueCurrency: 'USD',
          revenueByCurrency: { USD: 129900 },
          revenueVisitorCount: 42,
          customerRate: 19,
          topSource: 'youtube'
        },
        chartData: [],
        breakdown: [
          {
            key: 'youtube',
            label: 'youtube',
            signups: 42,
            customers: 8,
            customerRate: 19,
            revenueCents: 129900,
            revenueCurrency: 'USD',
            revenueByCurrency: { USD: 129900 },
            revenuePerSignupCents: 3092
          }
        ],
        revenueTruncated: false
      };

      setupMockFetch(mockStats);

      const result = await analytics.V1.Stats.getAdsStats({
        dimension: 'source',
        value: 'youtube',
        startDate: 'last week',
        endDate: 'now',
        revenueMode: 'all_revenue'
      });

      expect(result.dimension).toBe('source');
      expect(result.totals.signups).toBe(42);
      expect(result.breakdown[0]?.key).toBe('youtube');

      const url = new URL(lastFetchUrl || '');
      expect(url.pathname).toBe('/api/v1/stats/ads');
      expect(url.searchParams.get('site_uuid')).toBe('test-site-uuid');
      expect(url.searchParams.get('dimension')).toBe('source');
      expect(url.searchParams.get('value')).toBe('youtube');
      expect(url.searchParams.get('start_date')).toBe('last week');
      expect(url.searchParams.get('end_date')).toBe('now');
      expect(url.searchParams.get('revenue_mode')).toBe('all_revenue');
    });

    test('omits optional ads stats filters when not provided', async () => {
      setupMockFetch({
        dimension: 'source',
        dimensionLabel: 'Source',
        attribution: {
          mode: 'last_click',
          modeLabel: 'Last Click',
          windowDays: 7,
          settingsPath: '/account/sites/123/attribution_settings',
          appliesToAdRevenue: false
        },
        revenueMode: {
          mode: 'all_revenue',
          label: 'All revenue',
          description: 'All revenue events'
        },
        totals: {
          signups: 0,
          customers: 0,
          revenueCents: 0,
          revenueCurrency: 'USD',
          revenueByCurrency: {},
          revenueVisitorCount: 0,
          customerRate: 0,
          topSource: ''
        },
        chartData: [],
        breakdown: [],
        revenueTruncated: false
      });

      await analytics.V1.Stats.getAdsStats();

      const url = new URL(lastFetchUrl || '');
      expect(url.searchParams.get('site_uuid')).toBe('test-site-uuid');
      expect(url.searchParams.has('dimension')).toBe(false);
      expect(url.searchParams.has('value')).toBe(false);
      expect(url.searchParams.has('start_date')).toBe(false);
      expect(url.searchParams.has('end_date')).toBe(false);
      expect(url.searchParams.has('revenue_mode')).toBe(false);
    });
  });
});