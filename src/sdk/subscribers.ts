import { BentoClient } from '.';

export class BentoSubscribers {
  constructor(private readonly _client: BentoClient) {}

  public getSubscribers() {
    return this._client.get('/fetch/subscribers');
  }
}
