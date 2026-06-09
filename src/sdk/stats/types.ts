export type SiteStats = {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed_count: number;
  broadcast_count: number;
  average_open_rate: number;
  average_click_rate: number;
};

export type SegmentStats = {
  segment_id: string;
  subscriber_count: number;
  growth_rate: number;
  engagement_rate: number;
  last_updated: string;
};

export type ReportStats = {
  report_id: string;
  total_sent: number;
  total_opens: number;
  unique_opens: number;
  total_clicks: number;
  unique_clicks: number;
  unsubscribes: number;
  spam_reports: number;
  created_at: string;
};

export type AdsStatsDimension = 'source' | 'campaign' | 'medium' | 'content' | 'ad';

export type AdsStatsRevenueMode = 'all_revenue' | 'first_revenue' | 'subscriptions';

export type AdsStatsParameters = {
  dimension?: AdsStatsDimension;
  value?: string;
  startDate?: string;
  endDate?: string;
  revenueMode?: AdsStatsRevenueMode;
};

export type AdsStatsAttribution = {
  mode: string;
  modeLabel: string;
  windowDays: number;
  settingsPath: string;
  appliesToAdRevenue: boolean;
};

export type AdsStatsRevenueModeDetails = {
  mode: AdsStatsRevenueMode;
  label: string;
  description: string;
};

export type AdsStatsTotals = {
  signups: number;
  customers: number;
  revenueCents: number;
  revenueCurrency: string;
  revenueByCurrency: Record<string, number>;
  revenueVisitorCount: number;
  customerRate: number;
  topSource: string;
};

export type AdsStatsChartDataPoint = {
  x: number;
  signups: number;
  customers: number;
  revenue: number;
};

export type AdsStatsBreakdownRow = {
  key: string;
  label: string;
  signups: number;
  customers: number;
  customerRate: number;
  revenueCents: number;
  revenueCurrency: string;
  revenueByCurrency: Record<string, number>;
  revenuePerSignupCents: number;
};

export type AdsStats = {
  dimension: AdsStatsDimension;
  dimensionLabel: string;
  attribution: AdsStatsAttribution;
  revenueMode: AdsStatsRevenueModeDetails;
  totals: AdsStatsTotals;
  chartData: AdsStatsChartDataPoint[];
  breakdown: AdsStatsBreakdownRow[];
  revenueTruncated: boolean;
};