import { AnalyticsOptions } from '../sdk/interfaces';
import {
  BentoBatch,
  BentoClient,
  BentoCommands,
  BentoExperimental,
  BentoFields,
  BentoForms,
  BentoSubscribers,
  BentoTags,
} from '../sdk';

export class BentoAPIV1<S = { [key: string]: any }, E = '$custom'> {
  private readonly _client: BentoClient;

  public readonly Batch: BentoBatch<S, E>;
  public readonly Commands: BentoCommands<S>;
  public readonly Experimental: BentoExperimental;
  public readonly Fields: BentoFields;
  public readonly Forms: BentoForms;
  public readonly Subscribers: BentoSubscribers<S>;
  public readonly Tags: BentoTags;

  constructor(options: AnalyticsOptions) {
    this._client = new BentoClient(options);
    this.Batch = new BentoBatch(this._client);
    this.Commands = new BentoCommands(this._client);
    this.Experimental = new BentoExperimental(this._client);
    this.Fields = new BentoFields(this._client);
    this.Forms = new BentoForms(this._client);
    this.Subscribers = new BentoSubscribers(this._client);
    this.Tags = new BentoTags(this._client);
  }
}
