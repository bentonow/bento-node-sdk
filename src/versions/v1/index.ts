import { AnalyticsOptions } from '../../sdk/interfaces';
import {
  BentoBatch,
  BentoClient,
  BentoCommands,
  BentoExperimental,
  BentoFields,
  BentoForms,
  BentoSubscribers,
  BentoTags,
} from '../../sdk';
import { AddSubscriberParameters, TagSubscriberParameters } from './types';
import { BentoEvents } from '../../sdk/batch/enums';

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

  /**
   * **This TRIGGERS automations!** - If you do not wish to trigger automations, please use the
   * `Commands.addTag` method.
   *
   * Tags a subscriber with the specified email and tag. If either the tag or the user
   * do not exist, they will be created in the system.
   *
   * Because this method uses the batch API, the tag may take between 1 and 3 minutes
   * to appear in the system.
   *
   * Returns `true` if the event was successfully dispatched. Returns `false` otherwise.
   *
   * @param parameters TagSubscriberParameters
   * @returns Promise\<boolean\>
   */
  async tagSubscriber(parameters: TagSubscriberParameters): Promise<boolean> {
    try {
      const result = await this.Batch.importEvents({
        events: [
          {
            details: {
              tag: parameters.tagName,
            },
            email: parameters.email,
            type: BentoEvents.TAG,
          },
        ],
      });

      return result === 1;
    } catch (e) {
      throw e;
    }
  }

  /**
   * **This TRIGGERS automations!** - If you do not wish to trigger automations, please use the
   * `Commands.subscribe` method.
   *
   * Creates a subscriber in the system. If the subscriber already exists, another subscribe event
   * will be sent, triggering any automations that take place upon subscription. Please be aware
   * of the potential consequences.
   *
   * Because this method uses the batch API, the tag may take between 1 and 3 minutes
   * to appear in the system.
   *
   * Returns `true` if the event was successfully dispatched. Returns `false` otherwise.
   *
   * @param parameters AddSubscriberParameters
   * @returns Promise\<boolean\>
   */
  async addSubscriber(parameters: AddSubscriberParameters): Promise<boolean> {
    try {
      const result = await this.Batch.importEvents({
        events: [
          {
            email: parameters.email,
            type: BentoEvents.SUBSCRIBE,
          },
        ],
      });

      return result === 1;
    } catch (e) {
      throw e;
    }
  }
}
