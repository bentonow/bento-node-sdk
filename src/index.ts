import { AnalyticsOptions } from './sdk/interfaces';
import { BentoClient, BentoSubscribers, BentoTags } from './sdk';

export class Analytics<S = { [key: string]: string }> {
  private readonly _client: BentoClient;

  public readonly Subscribers: BentoSubscribers<S>;
  public readonly Tags: BentoTags;

  constructor(options: AnalyticsOptions) {
    this._client = new BentoClient(options);
    this.Subscribers = new BentoSubscribers(this._client);
    this.Tags = new BentoTags(this._client);
  }
}

export * from './sdk/client/errors';
