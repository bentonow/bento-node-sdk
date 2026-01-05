import type { BentoClient } from '../client';
import type { DataResponse } from '../client/types';
import type { EmailTemplate, GetEmailTemplateParameters, UpdateEmailTemplateParameters } from './types';

export class BentoEmailTemplates {
  private readonly _url = '/fetch/emails/templates';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns a single email template by ID.
   *
   * @param parameters GetEmailTemplateParameters
   * @returns Promise\<EmailTemplate | null\>
   */
  public async getEmailTemplate(parameters: GetEmailTemplateParameters): Promise<EmailTemplate | null> {
    const result = await this._client.get<DataResponse<EmailTemplate>>(`${this._url}/${parameters.id}`);

    if (Object.keys(result).length === 0 || !result.data) return null;
    return result.data;
  }

  /**
   * Updates an email template's subject and/or HTML content.
   *
   * @param parameters UpdateEmailTemplateParameters
   * @returns Promise\<EmailTemplate | null\>
   */
  public async updateEmailTemplate(parameters: UpdateEmailTemplateParameters): Promise<EmailTemplate | null> {
    const { id, ...updateFields } = parameters;

    const result = await this._client.patch<DataResponse<EmailTemplate>>(`${this._url}/${id}`, {
      email_template: updateFields,
    });

    if (Object.keys(result).length === 0 || !result.data) return null;
    return result.data;
  }
}
