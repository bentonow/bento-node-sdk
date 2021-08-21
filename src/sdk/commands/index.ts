import {
  AddFieldParameters,
  AddTagParameters,
  RemoveFieldParameters,
  RemoveTagParameters,
  SubscribeParameters,
  UnsubscribeParameters,
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

  /**
   * Removes a field to the subscriber with the matching email.
   *
   * @param parameters \{ email: string, fieldName: string \}
   * @returns Promise<Subscriber> | null
   */
  public async removeField(
    parameters: RemoveFieldParameters
  ): Promise<Subscriber<S> | null> {
    try {
      const result = await this._client.post<DataResponse<Subscriber<S>>>(
        this._url,
        {
          command: {
            command: CommandTypes.REMOVE_FIELD,
            email: parameters.email,
            query: parameters.fieldName,
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
   * Subscribes the supplied email to Bento. If the email does not exist, it is created.
   * If the subscriber had previously unsubscribed, they will be re-subscribed.
   *
   * @param parameters \{ email: string \}
   * @returns Promise<Subscriber> | null
   */
  public async subscribe(
    parameters: SubscribeParameters
  ): Promise<Subscriber<S> | null> {
    try {
      const result = await this._client.post<DataResponse<Subscriber<S>>>(
        this._url,
        {
          command: {
            command: CommandTypes.SUBSCRIBE,
            email: parameters.email,
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
   * Unsubscribes the supplied email to Bento. If the email does not exist, it is created and
   * immediately unsubscribed. If they had already unsubscribed, the `unsubscribed_at` property
   * is updated.
   *
   * @param parameters \{ email: string \}
   * @returns Promise<Subscriber> | null
   */
  public async unsubscribe(
    parameters: UnsubscribeParameters
  ): Promise<Subscriber<S> | null> {
    try {
      const result = await this._client.post<DataResponse<Subscriber<S>>>(
        this._url,
        {
          command: {
            command: CommandTypes.UNSUBSCRIBE,
            email: parameters.email,
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
