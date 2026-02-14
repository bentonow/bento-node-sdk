import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { EmailTemplate } from '../email-templates/types';
import type { CreateSequenceEmailParameters, Sequence } from './types';

export class BentoSequences {
  private readonly _url = '/fetch/sequences';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns all of the sequences for the site, including their email templates.
   *
   * @returns Promise\<Sequence[]\>
   */
  public async getSequences(): Promise<Sequence[]> {
    const result = await this._client.get<DataResponse<Sequence[]>>(this._url);

    if (!result || Object.keys(result).length === 0) return [];
    return result.data ?? [];
  }

  /**
   * Creates a new email template inside a sequence.
   *
   * @param sequenceId string
   * @param parameters CreateSequenceEmailParameters
   * @returns Promise\<EmailTemplate | null\>
   */
  public async createSequenceEmail(
    sequenceId: string,
    parameters: CreateSequenceEmailParameters
  ): Promise<EmailTemplate | null> {
    const result = await this._client.post<DataResponse<EmailTemplate>>(
      `${this._url}/${sequenceId}/emails/templates`,
      {
        email_template: parameters,
      }
    );

    if (Object.keys(result).length === 0 || !result.data) return null;
    return result.data;
  }
}
