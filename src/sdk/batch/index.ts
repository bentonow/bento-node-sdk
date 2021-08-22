import {
  BatchImportSubscribersParameter,
  BatchImportSubscribersResponse,
} from './types';
import { BentoClient } from '../client';
import { TooFewSubscribersError, TooManySubscribersError } from './errors';

export class BentoBatch<S> {
  private readonly _maxBatchSize = 1000;
  private readonly _url = '/batch';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Creates a batch job to import subscribers into the system. You can pass in
   * between 1 and 1,000 subscribers to import. Each subscriber must have an email,
   * and may optionally have any additional fields. The additional fields are added
   * as custom fields on the subscriber.
   *
   * Returns the number of subscribers that were imported.
   *
   * @param parameter
   * @returns Promise<number>
   */
  public async importSubscribers(
    parameters: BatchImportSubscribersParameter<S>
  ): Promise<number> {
    try {
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
    } catch (error) {
      throw error;
    }
  }
}
