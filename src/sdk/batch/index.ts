import type { BentoClient } from '../client';
import {
  TooFewEventsError,
  TooFewSubscribersError,
  TooManyEventsError,
  TooManySubscribersError,
} from './errors';
import type {
  BatchImportEmailsParameter,
  BatchImportEmailsResponse,
  BatchImportEventsParameter,
  BatchImportEventsResponse,
  BatchImportSubscribersParameter,
  BatchImportSubscribersResponse,
} from './types';

export class BentoBatch<S, E extends string> {
  private readonly _maxEmailBatchSize = 100;
  private readonly _maxBatchSize = 1000;
  private readonly _url = '/batch';

  constructor(private readonly _client: BentoClient) {}

  /**
   * **This does not trigger automations!** - If you wish to trigger automations, please batch import
   * events with the type set to `BentoEvents.SUBSCRIBE`, or `$subscribe`. Note that the batch event import
   * cannot attach custom fields and will ignore everything except the email.
   *
   * Creates a batch job to import subscribers into the system. You can pass in
   * between 1 and 1,000 subscribers to import. Each subscriber must have an email,
   * and may optionally have any additional fields. The additional fields are added
   * as custom fields on the subscriber.
   *
   * This method is processed by the Bento import queues and it may take between 1 and
   * 5 minutes for the results to appear in your dashboard.
   *
   * Returns the number of subscribers that were imported.
   *
   * @param parameters
   * @returns Promise\<number\>
   */
  public async importSubscribers(
    parameters: BatchImportSubscribersParameter<S>
  ): Promise<number> {
    if (parameters.subscribers.length === 0) {
      throw new TooFewSubscribersError(
        `You must send between 1 and 1,000 subscribers.`
      );
    }

    if (parameters.subscribers.length > this._maxBatchSize) {
      throw new TooManySubscribersError(
        `You must send between 1 and 1,000 subscribers.`
      );
    }

    const result = await this._client.post<BatchImportSubscribersResponse>(
      `${this._url}/subscribers`,
      {
        subscribers: parameters.subscribers,
      }
    );

    return result.results;
  }

  /**
   * Creates a batch job to import events into the system. You can pass in
   * between 1 and 1,000 events to import. Each event must have an email and
   * a type. In addition to this, you my pass in additional data in the
   * `details` property.
   *
   * Returns the number of events that were imported.
   *
   * @param parameters
   * @returns Promise\<number\>
   */
  public async importEvents(
    parameters: BatchImportEventsParameter<S, E>
  ): Promise<number> {
    if (parameters.events.length === 0) {
      throw new TooFewEventsError(`You must send between 1 and 1,000 events.`);
    }

    if (parameters.events.length > this._maxBatchSize) {
      throw new TooManyEventsError(`You must send between 1 and 1,000 events.`);
    }

    const result = await this._client.post<BatchImportEventsResponse>(
      `${this._url}/events`,
      {
        events: parameters.events,
      }
    );

    return result.results;
  }

  /**
   * Creates a batch job to import emails into the system. You can pass in
   * between 1 and 100 emails to import.
   * Creates a batch job to import transactional emails into the system.
   * You can pass in between 1 and 100 emails to import.
   * Each email must have a `to` address, a `from` address, a `subject`, an `html_body`
   * and `transactional: true`.
   * In addition you can add a `personalization` object to provide
   * liquid tsags that will be injected into the email.
   *
   * Returns the number of events that were imported.
   *
   * @param parameters
   * @returns Promise\<number\>
   */
  public async importEmails(
    parameters: BatchImportEmailsParameter
  ): Promise<number> {
    if (parameters.emails.length === 0) {
      throw new TooFewEventsError(`You must send between 1 and 100 emails.`);
    }

    if (parameters.emails.length > this._maxEmailBatchSize) {
      throw new TooManyEventsError(`You must send between 1 and 100 emails.`);
    }

    const result = await this._client.post<BatchImportEmailsResponse>(
      `${this._url}/emails`,
      {
        emails: parameters.emails,
      }
    );

    return result.results;
  }
}
