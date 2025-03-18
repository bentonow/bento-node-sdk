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