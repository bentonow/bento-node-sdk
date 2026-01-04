import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { Workflow } from './types';

export class BentoWorkflows {
  private readonly _url = '/fetch/workflows';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns all of the workflows for the site, including their email templates.
   *
   * @returns Promise\<Workflow[] | null\>
   */
  public async getWorkflows(): Promise<Workflow[] | null> {
    const result = await this._client.get<DataResponse<Workflow[]>>(this._url);

    if (Object.keys(result).length === 0 || !result.data) return null;
    return result.data;
  }
}
