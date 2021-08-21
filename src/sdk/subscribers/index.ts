import { BentoClient } from '../client';
import { DataResponse } from '../client/types';
import {
  CreateSubscriberParameters,
  GetSubscribersParameters,
  Subscriber,
} from './types';

export class BentoSubscribers<S> {
  constructor(private readonly _client: BentoClient) {}

  public async getSubscribers(parameters?: GetSubscribersParameters) {
    try {
      const result = await this._client.get<DataResponse<Subscriber<S>>>(
        '/fetch/subscribers',
        parameters
      );

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  public async createSubscriber(parameters: CreateSubscriberParameters) {
    try {
      const result = await this._client.post<DataResponse<Subscriber<S>>>(
        '/fetch/subscribers',
        parameters
      );

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
