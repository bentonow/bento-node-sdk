import {
  BentoBatch,
  BentoClient,
  BentoCommands,
  BentoEmailTemplates,
  BentoExperimental,
  BentoFields,
  BentoForms,
  BentoSequences,
  BentoSubscribers,
  BentoTags,
  BentoWorkflows,
} from '../../sdk';
import { BentoEvents } from '../../sdk/batch/enums';
import type { AnalyticsOptions } from '../../sdk/interfaces';
import type {
  AddSubscriberParameters,
  RemoveSubscriberParameters,
  TagSubscriberParameters,
  TrackParameters,
  TrackPurchaseParameters,
  UpdateFieldsParameters,
} from './types';
import { BentoBroadcasts } from '../../sdk/broadcasts';
import { BentoStats } from '../../sdk/stats';
import { Subscriber } from '../../sdk/subscribers/types';

export class BentoAPIV1<S = { [key: string]: unknown }, E extends string = '$custom'> {
  private readonly _client: BentoClient;

  public readonly Broadcasts: BentoBroadcasts;
  public readonly EmailTemplates: BentoEmailTemplates;
  public readonly Stats: BentoStats;
  public readonly Batch: BentoBatch<S, E>;
  public readonly Commands: BentoCommands<S>;
  public readonly Experimental: BentoExperimental;
  public readonly Fields: BentoFields;
  public readonly Forms: BentoForms;
  public readonly Sequences: BentoSequences;
  public readonly Subscribers: BentoSubscribers<S>;
  public readonly Tags: BentoTags;
  public readonly Workflows: BentoWorkflows;

  constructor(options: AnalyticsOptions) {
    this._client = new BentoClient(options);
    this.Broadcasts = new BentoBroadcasts(this._client);
    this.EmailTemplates = new BentoEmailTemplates(this._client);
    this.Stats = new BentoStats(this._client);
    this.Batch = new BentoBatch(this._client);
    this.Commands = new BentoCommands(this._client);
    this.Experimental = new BentoExperimental(this._client);
    this.Fields = new BentoFields(this._client);
    this.Forms = new BentoForms(this._client);
    this.Sequences = new BentoSequences(this._client);
    this.Subscribers = new BentoSubscribers(this._client);
    this.Tags = new BentoTags(this._client);
    this.Workflows = new BentoWorkflows(this._client);
  }

  /**
   * **This TRIGGERS automations!** - If you do not wish to trigger automations, please use the
   * `Commands.addTag` method.
   *
   * Tags a subscriber with the specified email and tag. If either the tag or the user
   * do not exist, they will be created in the system. If the user already has the tag,
   * another tag event will be sent, triggering any automations that take place upon a
   * tag being added to a subscriber. Please be aware of the potential consequences.
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
    const result = await this.Batch.importEvents({
      events: [
        {
          date: parameters.date,
          details: {
            tag: parameters.tagName,
          },
          email: parameters.email,
          type: BentoEvents.TAG,
        },
      ],
    });

    return result === 1;
  }

  /**
   * **This TRIGGERS automations!** - If you do not wish to trigger automations, please use the
   * `Commands.subscribe` method.
   *
   * Creates a subscriber in the system. If the subscriber already exists, another subscribe event
   * will be sent, triggering any automations that take place upon subscription. Please be aware
   * of the potential consequences.
   *
   * You may optionally pass any fields that you wish to be set on the subscriber during creation
   * as well as a `Date` which will backdate the event. If no date is supplied, then the event will
   * default to the current time.
   *
   * Because this method uses the batch API, the tag may take between 1 and 3 minutes
   * to appear in the system.
   *
   * Returns `true` if the event was successfully dispatched. Returns `false` otherwise.
   *
   * @param parameters AddSubscriberParameters
   * @returns Promise\<boolean\>
   */
  async addSubscriber(parameters: AddSubscriberParameters<S>): Promise<boolean> {
    const result = await this.Batch.importEvents({
      events: [
        {
          date: parameters.date,
          email: parameters.email,
          type: BentoEvents.SUBSCRIBE,
          fields: parameters.fields || {},
        },
      ],
    });

    return result === 1;
  }

  /**
   * **This TRIGGERS automations!** - If you do not wish to trigger automations, please use the
   * `Commands.unsubscribe` method.
   *
   * Unsubscribes an email in the system. If the email is already unsubscribed, another unsubscribe event
   * will be sent, triggering any automations that take place upon an unsubscribe happening. Please be aware
   * of the potential consequences.
   *
   * You may optionally pass a `Date` which will backdate the event. If no date is supplied, then the event
   * will default to the current time.
   *
   * Because this method uses the batch API, the tag may take between 1 and 3 minutes
   * to appear in the system.
   *
   * Returns `true` if the event was successfully dispatched. Returns `false` otherwise.
   *
   * @param parameters RemoveSubscriberParameters
   * @returns Promise\<boolean\>
   */
  async removeSubscriber(parameters: RemoveSubscriberParameters): Promise<boolean> {
    const result = await this.Batch.importEvents({
      events: [
        {
          date: parameters.date,
          email: parameters.email,
          type: BentoEvents.UNSUBSCRIBE,
        },
      ],
    });

    return result === 1;
  }

  /**
   * **This TRIGGERS automations!** - If you do not wish to trigger automations, please use the
   * `Commands.addField` method.
   *
   * Sets the passed-in custom fields on the subscriber, creating the subscriber if it does not exist.
   * If the fields are already set on the subscriber, the event will be sent, triggering any automations
   * that take place upon fields being updated. Please be aware of the potential consequences.
   *
   * You may optionally pass a `Date` which will backdate the event. If no date is supplied, then the event
   * will default to the current time.
   *
   * Because this method uses the batch API, the tag may take between 1 and 3 minutes
   * to appear in the system.
   *
   * Returns `true` if the event was successfully dispatched. Returns `false` otherwise.
   *
   * @param parameters UpdateFieldsParameters\<S\>
   * @returns Promise\<boolean\>
   */
  async updateFields(parameters: UpdateFieldsParameters<S>): Promise<boolean> {
    const result = await this.Batch.importEvents({
      events: [
        {
          date: parameters.date,
          email: parameters.email,
          type: BentoEvents.UPDATE_FIELDS,
          fields: parameters.fields,
        },
      ],
    });

    return result === 1;
  }

  /**
   * **This TRIGGERS automations!** - There is no way to achieve this same behavior without triggering
   * automations.
   *
   * Tracks a purchase in Bento, used to calculate LTV for your subscribers. The values that are received
   * should be numbers, in cents. For example, `$1.00` should be `100`.
   *
   * You may optionally pass a `Date` which will backdate the event. If no date is supplied, then the event
   * will default to the current time.
   *
   * Because this method uses the batch API, the tag may take between 1 and 3 minutes
   * to appear in the system.
   *
   * Returns `true` if the event was successfully dispatched. Returns `false` otherwise.
   *
   * @param parameters TrackPurchaseParameters
   * @returns Promise\<boolean\>
   */
  async trackPurchase(parameters: TrackPurchaseParameters): Promise<boolean> {
    const result = await this.Batch.importEvents({
      events: [
        {
          date: parameters.date,
          email: parameters.email,
          type: BentoEvents.PURCHASE,
          details: parameters.purchaseDetails,
        },
      ],
    });

    return result === 1;
  }

  /**
   * **This TRIGGERS automations!** - There is no way to achieve this same behavior without triggering
   * automations.
   *
   * Tracks a custom event in Bento.
   *
   * You may optionally pass a `Date` which will backdate the event. If no date is supplied, then the event
   * will default to the current time.
   *
   * Because this method uses the batch API, the tag may take between 1 and 3 minutes
   * to appear in the system.
   *
   * Returns `true` if the event was successfully dispatched. Returns `false` otherwise.
   *
   * @param parameters TrackParameters<S, E>
   * @returns Promise\<boolean\>
   */
  async track(parameters: TrackParameters<S, E>): Promise<boolean> {
    const result = await this.Batch.importEvents({
      events: [parameters],
    });

    return result === 1;
  }

  /**
   * Upserts a subscriber in Bento. If the subscriber exists, their data will be updated.
   * If they don't exist, they will be created with the provided data.
   *
   * @example
   * ```typescript
   * await analytics.V1.upsertSubscriber({
   *   email: 'user@example.com',
   *   fields: {
   *     firstName: 'John',
   *     lastName: 'Doe'
   *   },
   *   tags: 'lead,mql',
   *   remove_tags: 'customer'
   * });
   * ```
   *
   * @param parameters Object containing subscriber data including email, fields, and tags
   * @returns Promise<Subscriber<S>> The created or updated subscriber
   */
  public async upsertSubscriber(
    parameters: Omit<AddSubscriberParameters<S>, 'date'> & {
      tags?: string;
      remove_tags?: string;
    }
  ): Promise<Subscriber<S> | null> {
    await this.Batch.importSubscribers({
      subscribers: [{
        email: parameters.email,
        ...parameters.fields,
        ...(parameters.tags && { tags: parameters.tags }),
        ...(parameters.remove_tags && { remove_tags: parameters.remove_tags })
      } as { email: string } & Partial<S>]
    });

    return this.Subscribers.getSubscribers({
      email: parameters.email
    });
  }
}
