import { AnalyticsOptions } from './sdk/interfaces';
import {
  BentoClient,
  BentoCommands,
  BentoExperimental,
  BentoFields,
  BentoForms,
  BentoSubscribers,
  BentoTags,
} from './sdk';

export class Analytics<S = { [key: string]: string }> {
  private readonly _client: BentoClient;

  public readonly Commands: BentoCommands<S>;
  public readonly Experimental: BentoExperimental;
  public readonly Fields: BentoFields;
  public readonly Forms: BentoForms;
  public readonly Subscribers: BentoSubscribers<S>;
  public readonly Tags: BentoTags;

  constructor(options: AnalyticsOptions) {
    this._client = new BentoClient(options);
    this.Commands = new BentoCommands(this._client);
    this.Experimental = new BentoExperimental(this._client);
    this.Fields = new BentoFields(this._client);
    this.Forms = new BentoForms(this._client);
    this.Subscribers = new BentoSubscribers(this._client);
    this.Tags = new BentoTags(this._client);
  }
}

export * from './sdk/client/errors';
