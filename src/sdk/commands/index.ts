import {
  AddFieldParameters,
  AddTagParameters,
  RemoveTagParameters,
} from './types';
import { BentoClient } from '../client';
import { DataResponse } from '../client/types';
import { Subscriber } from '../subscribers/types';
import { CommandTypes } from './enums';

export class BentoCommands<S> {
  private readonly _url = '/fetch/commands';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Adds a tag to the subscriber with the matching email.
   *
   * Note that both the tag and the subscriber will be created if either is missing
   * from system.
   *
   * @param parameters \{ email: string, tagName: string \}
   * @returns Promise<Subscriber> | null
   */
  public async addTag(
    parameters: AddTagParameters
  ): Promise<Subscriber<S> | null> {
    try {
      const result = await this._client.post<DataResponse<Subscriber<S>>>(
        this._url,
        {
          command: {
            command: CommandTypes.ADD_TAG,
            email: parameters.email,
            query: parameters.tagName,
          },
        }
      );

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Removes the specified tag from the subscriber with the matching email.
   *
   * @param parameters \{ email: string, tagName: string \}
   * @returns Promise<Subscriber> | null
   */
  public async removeTag(
    parameters: RemoveTagParameters
  ): Promise<Subscriber<S> | null> {
    try {
      const result = await this._client.post<DataResponse<Subscriber<S>>>(
        this._url,
        {
          command: {
            command: CommandTypes.REMOVE_TAG,
            email: parameters.email,
            query: parameters.tagName,
          },
        }
      );

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds a field to the subscriber with the matching email.
   *
   * Note that both the field and the subscriber will be created if either is missing
   * from system.
   *
   * @param parameters \{ email: string, field: \{ key: string; value: string; \} \}
   * @returns Promise<Subscriber> | null
   */
  public async addField(
    parameters: AddFieldParameters
  ): Promise<Subscriber<S> | null> {
    try {
      const result = await this._client.post<DataResponse<Subscriber<S>>>(
        this._url,
        {
          command: {
            command: CommandTypes.ADD_FIELD,
            email: parameters.email,
            query: parameters.field,
          },
        }
      );

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
