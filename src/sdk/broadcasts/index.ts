import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { Broadcast, CreateBroadcastInput, EmailData } from './types';

export class BentoBroadcasts {
  private readonly _fetchUrl = '/fetch/broadcasts';
  private readonly _batchUrl = '/batch/broadcasts';
  private readonly _emailsUrl = '/batch/emails';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Creates transactional emails in batch
   * @param emails Array of email data to send
   * @returns Promise<number> Number of emails successfully created
   */
  public async createEmails(emails: EmailData[]): Promise<number> {
    const result = await this._client.post<{ results: number }>(this._emailsUrl, {
      emails,
    });
    return result.results;
  }

  /**
   * Retrieves all broadcasts for the site
   * @returns Promise<Broadcast[]>
   */
  public async getBroadcasts(): Promise<Broadcast[]> {
    const result = await this._client.get<DataResponse<Broadcast[]>>(this._fetchUrl);
    return result.data ?? [];
  }

  /**
   * Creates new broadcast campaigns
   * @param broadcasts Array of broadcast data to create
   * @returns Promise<Broadcast[]>
   */
  public async createBroadcast(broadcasts: CreateBroadcastInput[]): Promise<Broadcast[]> {
    const result = await this._client.post<DataResponse<Broadcast[]>>(this._batchUrl, {
      broadcasts,
    });
    return result.data ?? [];
  }
}
