import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { CreateTagParameters, Tag } from './types';

export class BentoTags {
  private readonly _url = '/fetch/tags';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns all of the fields for the site.
   *
   * @returns Promise\<Tag[] | null\>
   */
  public async getTags(): Promise<Tag[] | null> {
    const result = await this._client.get<DataResponse<Tag[]>>(this._url);

    if (Object.keys(result).length === 0 || !result.data) return null;
    return result.data;
  }

  /**
   * Creates a tag inside of Bento.
   *
   * @param parameters CreateTagParameters
   * @returns Promise\<Tag[] | null\>
   */
  public async createTag(parameters: CreateTagParameters): Promise<Tag[] | null> {
    const result = await this._client.post<DataResponse<Tag[]>>(this._url, {
      tag: parameters,
    });

    if (Object.keys(result).length === 0 || !result.data) return null;
    return result.data;
  }
}
