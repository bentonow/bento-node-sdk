import type { BentoClient } from '../client';
import type { SiteStats, SegmentStats, ReportStats } from './types';

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
    const result = await this._client.get<SegmentStats>(`${this._url}/segments/${segmentId}`);
    return result;
  }

  /**
   * Retrieves statistics for a specific report
   * @param reportId ID of the report to get stats for
   * @returns Promise<ReportStats>
   */
  public async getReportStats(reportId: string): Promise<ReportStats> {
    const result = await this._client.get<ReportStats>(`${this._url}/reports/${reportId}`);
    return result;
  }
}