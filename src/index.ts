import { AnalyticsOptions } from './sdk/interfaces';
import { BentoClient } from './sdk/client';
import { BentoSubscribers } from './sdk/subscribers';

export class Analytics {
  private readonly client: BentoClient;
  public readonly Subscribers: BentoSubscribers;

  constructor(options: AnalyticsOptions) {
    this.client = new BentoClient(options);
    this.Subscribers = new BentoSubscribers(this.client);
  }
}
