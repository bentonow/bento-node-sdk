import fetch from 'cross-fetch';
import type { AnalyticsOptions, AuthenticationOptions } from '../interfaces';
import { NotAuthorizedError, RateLimitedError, AuthorNotAuthorizedError } from './errors';

function encodeBase64(str: string): string {
  if (typeof btoa === 'function') {
    return btoa(str);
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64');
  } else {
    // Fallback implementation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }
    return output;
  }
}
export class BentoClient {
  private readonly _headers: HeadersInit = {};
  private readonly _baseUrl: string = 'https://app.bentonow.com/api/v1';
  private readonly _siteUuid: string = '';
  private readonly _logErrors: boolean = false;

  constructor(options: AnalyticsOptions) {
    this._baseUrl = options.clientOptions?.baseUrl || this._baseUrl;
    this._siteUuid = options.siteUuid;
    this._headers = this._extractHeaders(options.authentication, options.siteUuid);
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
  public get<T>(endpoint: string, payload: Record<string, unknown> = {}): Promise<T> {
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
  public post<T>(endpoint: string, payload: Record<string, unknown> = {}): Promise<T> {
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
   * Extracts the `publishableKey` and `secretKey` from the `authentication` options,
   * adds the `Authorization` header, and includes a `User-Agent` header with the site UUID.
   *
   * @param authentication AuthenticationOptions
   * @param siteUuid string The site UUID to be included in the User-Agent header
   * @returns HeadersInit
   */
  private _extractHeaders(authentication: AuthenticationOptions, siteUuid: string): HeadersInit {
    const authenticationKey = encodeBase64(
      `${authentication.publishableKey}:${authentication.secretKey}`
    );

    return {
      Authorization: `Basic ${authenticationKey}`,
      'User-Agent': `bento-node-${siteUuid}`,
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
    let json: any = null;

    // Try to parse the response body based on content type
    try {
      if (contentType?.toLowerCase().includes('application/json')) {
        // For JSON content type, try to parse as JSON
        try {
          json = await response.json();
        } catch {
          responseMessage = 'Unable to parse JSON response';
        }
      } else if (contentType?.toLowerCase().includes('text/plain')) {
        // For text/plain content type, read as text
        try {
          responseMessage = await response.text();
        } catch {
          responseMessage = 'Unable to read text response';
        }
      } else {
        // For unknown content types, use default message
        responseMessage = 'Unknown response from the Bento API.';
      }
    } catch {
      responseMessage = 'Unable to read response body';
    }

    // Check for author not authorized error in JSON response
    if (json && json.error === 'Author not authorized to send on this account') {
      return new AuthorNotAuthorizedError(json.error);
    }

    // If we have JSON but no specific error match, use the JSON string
    if (json) {
      responseMessage = JSON.stringify(json);
    }

    // If we still don't have a message, use a default
    if (!responseMessage) {
      responseMessage = 'Unknown response from the Bento API.';
    }

    return new Error(`[${response.status}] - ${responseMessage}`);
  }
}
