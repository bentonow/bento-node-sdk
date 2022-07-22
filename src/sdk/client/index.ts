import fetch from 'isomorphic-fetch';
import type { AnalyticsOptions, AuthenticationOptions } from '../interfaces';
import { NotAuthorizedError, RateLimitedError } from './errors';

export class BentoClient {
  private readonly _headers: HeadersInit = {};
  private readonly _baseUrl: string = 'https://app.bentonow.com/api/v1';
  private readonly _siteUuid: string = '';
  private readonly _logErrors: boolean = false;

  constructor(options: AnalyticsOptions) {
    this._baseUrl = options.clientOptions?.baseUrl || this._baseUrl;
    this._siteUuid = options.siteUuid;
    this._headers = this._extractHeaders(options.authentication);
    this._logErrors = options.logErrors || false;
  }

  /**
   * Wraps a GET request to the Bento API and automatically adds the required
   * headers.
   *
   * @param endpoint string
   * @param payload object
   * @returns Promise\<T\>
   * */
  public get<T>(
    endpoint: string,
    payload: Record<string, unknown> = {}
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const queryParameters = this._getQueryParameters(payload);

      fetch(`${this._baseUrl}${endpoint}?${queryParameters}`, {
        method: 'GET',
        headers: this._headers,
      })
        .then(async (result) => {
          if (this._isSuccessfulStatus(result.status)) {
            return result.json();
          }

          throw await this._getErrorForResponse(result);
        })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  }

  /**
   * Wraps a POST request to the Bento API and automatically adds the required
   * headers.
   *
   * @param endpoint string
   * @param payload object
   * @returns Promise\<T\>
   * */
  public post<T>(
    endpoint: string,
    payload: Record<string, unknown> = {}
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const body = this._getBody(payload);

      fetch(`${this._baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          ...this._headers,
          'Content-Type': 'application/json',
        },
        body,
      })
        .then(async (result) => {
          if (this._isSuccessfulStatus(result.status)) {
            return result.json();
          }

          throw await this._getErrorForResponse(result);
        })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  }

  /**
   * Extracts the `publishableKey` and `secretKey` from the `authentication` options and
   * adds the `Authorization` header.
   *
   * @param authentication AuthenticationOptions
   * @returns HeadersInit
   */
  private _extractHeaders(authentication: AuthenticationOptions): HeadersInit {
    const authenticationKey = Buffer.from(
      `${authentication.publishableKey}:${authentication.secretKey}`
    ).toString('base64');

    return {
      Authorization: `Basic ${authenticationKey}`,
    };
  }

  /**
   * Takes the existing payload and adds the `site_uuid` to it, then returns
   * it out as a JSON string so that it can be sent alongside the request.
   *
   * @param payload object
   * @returns string
   */
  private _getBody(payload: Record<string, unknown>): string {
    return JSON.stringify({
      ...payload,
      site_uuid: this._siteUuid,
    });
  }

  /**
   * Takes the existing payload and adds the `site_uuid` to it, converts the
   * object to a query string so that it can be sent alongside a GET request.
   *
   * @param payload object
   * @returns string
   */
  private _getQueryParameters(payload: Record<string, unknown>): string {
    const body = {
      ...payload,
      site_uuid: this._siteUuid,
    };

    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      queryParameters.append(key, value);
    }

    return queryParameters.toString();
  }

  /**
   * Filters down the status codes to those that are considered a 'success'.
   *
   * @param statusCode number
   * @returns boolean
   */
  private _isSuccessfulStatus(statusCode: number): boolean {
    const validStatusCodes: number[] = [200, 201];

    return validStatusCodes.includes(statusCode);
  }

  /**
   * Returns an appropriate error to be thrown given the received response.
   *
   * @param response Response
   * @returns Error
   */
  private async _getErrorForResponse(response: Response): Promise<Error> {
    if (this._logErrors) {
      console.error(response);
    }

    if (response.status === 401) return new NotAuthorizedError();
    if (response.status === 429) return new RateLimitedError();

    const contentType = response.headers.get('Content-Type');
    let responseMessage = '';

    switch (contentType?.toLocaleLowerCase()) {
      case 'text/plain':
        responseMessage = await response.text();
        break;
      case 'application/json':
        responseMessage = JSON.stringify(await response.json());
        break;
      default:
        responseMessage = 'Unknown response from the Bento API.';
        break;
    }

    return new Error(`[${response.status}] - ${responseMessage}`);
  }
}
