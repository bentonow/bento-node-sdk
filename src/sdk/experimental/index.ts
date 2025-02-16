import type { BentoClient } from '../client';
import type { LocationData } from '../types';
import type {
  BlacklistCheckInput,
  BlacklistParameters,
  BlacklistResponse, BlacklistResult, ContentModerationResult,
  GeolocateParameters,
  GeolocateResponse,
  GuessGenderParameters,
  GuessGenderResponse,
  ValidateEmailParameters,
  ValidateEmailResponse,
} from './types';

export class BentoExperimental {
  private readonly _url = '/experimental';

  constructor(private readonly _client: BentoClient) {}

  /**
   * **EXPERIMENTAL** -
   * This functionality is experimental and may change or stop working at any time.
   *
   * Attempts to validate the email. You can provide additional information to further
   * refine the validation.
   *
   * If a name is provided, it compares it against the US Census Data, and so the results
   * may be biased.
   *
   * @param parameters
   * @returns Promise\<boolean\>
   */
  public async validateEmail(parameters: ValidateEmailParameters): Promise<boolean> {
    const result = await this._client.post<ValidateEmailResponse>(`${this._url}/validation`, {
      email: parameters.email,
      ip: parameters.ip,
      name: parameters.name,
      user_agent: parameters.userAgent,
    });

    return result.valid;
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
   * @returns Promise\<GuessGenderResponse\>
   */
  public async guessGender(parameters: GuessGenderParameters): Promise<GuessGenderResponse> {
    const result = await this._client.post<GuessGenderResponse>(`${this._url}/gender`, parameters);

    return result;
  }

  /**
   * **EXPERIMENTAL** -
   * This functionality is experimental and may change or stop working at any time.
   *
   * Attempts to provide location data given a provided IP address.
   *
   * @param parameters
   * @returns Promise\<GeolocateResponse\>
   */
  public async geolocate(parameters: GeolocateParameters): Promise<LocationData | null> {
    const result = await this._client.get<GeolocateResponse>(
      `${this._url}/geolocation`,
      parameters
    );

    if (Object.keys(result).length === 0) return null;
    return result as LocationData;
  }

  /**
   * **EXPERIMENTAL** -
   * This functionality is experimental and may change or stop working at any time.
   *
   * Looks up the provided URL or IP Address against various blacklists to see if the site has been
   * blacklisted anywhere.
   *
   * @param parameters
   * @returns Promise\<BlacklistResponse\>
   */
  public async checkBlacklist(parameters: BlacklistParameters): Promise<BlacklistResponse> {
    const result = await this._client.get<BlacklistResponse>(
      `${this._url}/blacklist.json`,
      parameters
    );

    return result;
  }

  /**
   * Checks if a domain or IP is blacklisted
   * @param input Domain or IP to check
   * @returns Promise<BlacklistResult>
   */
  public async getBlacklistStatus(input: BlacklistCheckInput): Promise<BlacklistResult> {
    return this._client.get<BlacklistResult>(`${this._url}/blacklist`, input);
  }

  /**
   * Performs content moderation on provided text
   * @param content Text content to moderate
   * @returns Promise<ContentModerationResult>
   */
  public async getContentModeration(content: string): Promise<ContentModerationResult> {
    return this._client.post<ContentModerationResult>(`${this._url}/moderation`, {
      content
    });
  }

  /**
   * Gets geolocation data for an IP address
   * @param ipAddress IP address to geolocate
   * @returns Promise<LocationData>
   */
  public async geoLocateIP(ipAddress: string): Promise<LocationData> {
    return this._client.get<LocationData>(`${this._url}/geolocation`, {
      ip: ipAddress
    });
  }
}
