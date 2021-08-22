import { ValidateEmailParameters, ValidateEmailResponse } from './types';
import { BentoClient } from '../client';

export class BentoExperimental {
  private readonly _url = '/experimental';

  constructor(private readonly _client: BentoClient) {}

  /**
   * **EXPERIMENTAL** -
   * This functionality is experimental and may change or stop working at any time.
   *
   * Attempts to validate the email. You can provide additional information to further
   * refine the validation
   *
   * If a name is provided, it compares it against the US Census Data, and so the results
   * may be biased.
   *
   * @param parameter
   * @returns Promise<boolean>
   */
  public async validateEmail(
    parameters: ValidateEmailParameters
  ): Promise<boolean> {
    try {
      const result = await this._client.post<ValidateEmailResponse>(
        `${this._url}/validation`,
        parameters
      );

      return result.valid;
    } catch (error) {
      throw error;
    }
  }
}
