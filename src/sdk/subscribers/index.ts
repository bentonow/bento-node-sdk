import { BentoClient } from '../client';
import { GetSubscribersParameters } from './types';

export class BentoSubscribers {
  constructor(private readonly _client: BentoClient) {}

  public getSubscribers(parameters?: GetSubscribersParameters) {
    return this._client.get('/fetch/subscribers', parameters);
  }
}
