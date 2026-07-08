import type { BentoClient } from '../client';
import type { SiteStats, SegmentStats, ReportStats, AdsStats, AdsStatsParameters } from './types';

export class BentoStats {
  private readonly _url = '/stats';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Retrieves overall statistics for the site
   * @returns Promise<SiteStats>
   */
  public async getSiteStats(): Promise<SiteStats> {
    const result = await this._client.get<SiteStats>(`${this._url}/site`);
    return result;
  }

  /**
   * Retrieves statistics for a specific segment
   * @param segmentId ID of the segment to get stats for
   * @returns Promise<SegmentStats>
   */
  public async getSegmentStats(segmentId: string): Promise<SegmentStats> {
    const result = await this._client.get<SegmentStats>(`${this._url}/segment`, {
      segment_id: segmentId,
    });
    return result;
  }

  /**
   * Retrieves statistics for a specific report
   * @param reportId ID of the report to get stats for
   * @returns Promise<ReportStats>
   */
  public async getReportStats(reportId: string): Promise<ReportStats> {
    const result = await this._client.get<ReportStats>(`${this._url}/report`, {
      report_id: reportId,
    });
    return result;
  }

  /**
   * Retrieves ads attribution statistics by UTM dimension or ad.
   * @param parameters Optional filters for dimension, value, date range, and revenue mode.
   * @returns Promise<AdsStats>
   */
  public async getAdsStats(parameters: AdsStatsParameters = {}): Promise<AdsStats> {
    const result = await this._client.get<AdsStats>(`${this._url}/ads`, {
      dimension: parameters.dimension,
      value: parameters.value,
      start_date: parameters.startDate,
      end_date: parameters.endDate,
      revenue_mode: parameters.revenueMode,
    });
    return result;
  }
}