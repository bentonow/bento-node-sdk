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
        user_count: 10,
        subscriber_count: 7,
        unsubscriber_count: 3,
      };

      setupMockFetch(mockStats);

      const result = await analytics.V1.Stats.getSiteStats();

      expect(result.user_count).toBe(10);
      expect(result.subscriber_count).toBe(7);
      expect(result.unsubscriber_count).toBe(3);
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
        user_count: 12,
        subscriber_count: 8,
        unsubscriber_count: 4,
      };

      setupMockFetch(mockStats);

      const result = await analytics.V1.Stats.getSegmentStats('segment-123');

      expect(result.user_count).toBe(12);
      expect(result.subscriber_count).toBe(8);
      expect(result.unsubscriber_count).toBe(4);
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
        data: 42,
        chart_style: 'counter',
        report_type: 'Reporting::Reports::VisitorCountReport',
        report_name: 'API Report',
      };

      setupMockFetch(mockStats);

      const result = await analytics.V1.Stats.getReportStats('report-123');

      expect(result.data).toBe(42);
      expect(result.chart_style).toBe('counter');
      expect(result.report_type).toBe('Reporting::Reports::VisitorCountReport');
      expect(result.report_name).toBe('API Report');
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