import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { Sequence } from './types';

export class BentoSequences {
  private readonly _url = '/fetch/sequences';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns all of the sequences for the site, including their email templates.
   *
   * @returns Promise\<Sequence[]\>
   */
  public async getSequences(): Promise<Sequence[]> {
    const result = await this._client.get<DataResponse<Sequence[]>>(this._url);

    if (!result || Object.keys(result).length === 0) return [];
    return result.data ?? [];
  }
}
