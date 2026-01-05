import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { Sequence } from './types';

export class BentoSequences {
  private readonly _url = '/fetch/sequences';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns all of the sequences for the site, including their email templates.
   *
   * @returns Promise\<Sequence[] | null\>
   */
  public async getSequences(): Promise<Sequence[] | null> {
    const result = await this._client.get<DataResponse<Sequence[]>>(this._url);

    if (Object.keys(result).length === 0 || !result.data) return null;
    return result.data;
  }
}
