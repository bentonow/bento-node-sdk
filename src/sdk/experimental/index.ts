import {
  BlacklistParameters,
  BlacklistResponse,
  GeolocateParameters,
  GeolocateResponse,
  GuessGenderParameters,
  GuessGenderResponse,
  ValidateEmailParameters,
  ValidateEmailResponse,
} from './types';
import { BentoClient } from '../client';
import { LocationData } from '../types';

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
   * @param parameters
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

  /**
   * **EXPERIMENTAL** -
   * This functionality is experimental and may change or stop working at any time.
   *
   * Attempts to guess the gender of the person given a provided name. It compares
   * the name against the US Census Data, and so the results may be biased.
   *
   * It is possible for the gender to be unknown if the system cannot confidently
   * conclude what gender it may be.
   *
   * @param parameters
   * @returns Promise<GuessGenderResponse>
   */
  public async guessGender(
    parameters: GuessGenderParameters
  ): Promise<GuessGenderResponse> {
    try {
      const result = await this._client.post<GuessGenderResponse>(
        `${this._url}/gender`,
        parameters
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * **EXPERIMENTAL** -
   * This functionality is experimental and may change or stop working at any time.
   *
   * Attempts to provide location data given a provided IP address.
   *
   * @param parameters
   * @returns Promise<GeolocateResponse>
   */
  public async geolocate(
    parameters: GeolocateParameters
  ): Promise<LocationData | null> {
    try {
      const result = await this._client.get<GeolocateResponse>(
        `${this._url}/geolocation`,
        parameters
      );

      if (Object.keys(result).length === 0) return null;
      return result as LocationData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * **EXPERIMENTAL** -
   * This functionality is experimental and may change or stop working at any time.
   *
   * Looks up the provided URL or IP Address against various blacklists to see if the site has been
   * blacklisted anywhere.
   *
   * @param parameters
   * @returns Promise<BlacklistResponse>
   */
  public async checkBlacklist(
    parameters: BlacklistParameters
  ): Promise<BlacklistResponse> {
    try {
      const result = await this._client.get<BlacklistResponse>(
        `${this._url}/blacklist.json`,
        parameters
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
