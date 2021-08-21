import { BentoClient } from '../client';
import { DataResponse } from '../client/types';
import { CreateTagParameters, Tag } from './types';

export class BentoTags {
  private readonly _url = '/fetch/tags';

  constructor(private readonly _client: BentoClient) {}

  public async getTags() {
    try {
      const result = await this._client.get<DataResponse<Tag[]>>(this._url);

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  public async createTag(parameters: CreateTagParameters) {
    try {
      const result = await this._client.post<DataResponse<Tag[]>>(this._url, {
        tag: parameters,
      });

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
