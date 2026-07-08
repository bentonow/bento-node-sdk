export type StatsCounts = {
  user_count: number;
  subscriber_count: number;
  unsubscriber_count: number;
};

export type SiteStats = StatsCounts;

export type SegmentStats = StatsCounts;

export type ReportStats = {
  data: unknown;
  chart_style?: string;
  report_type?: string;
  report_name?: string;
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
