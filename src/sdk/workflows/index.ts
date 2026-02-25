import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { GetWorkflowsParameters, Workflow } from './types';

export class BentoWorkflows {
  private readonly _url = '/fetch/workflows';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns all of the workflows for the site, including their email templates.
   *
   * @param parameters Optional pagination parameters (e.g., { page: 2 })
   * @returns Promise\<Workflow[]\>
   */
  public async getWorkflows(parameters: GetWorkflowsParameters = {}): Promise<Workflow[]> {
    const result = await this._client.get<DataResponse<Workflow[]>>(this._url, parameters);

    if (!result || Object.keys(result).length === 0) return [];
    return result.data ?? [];
  }
}
