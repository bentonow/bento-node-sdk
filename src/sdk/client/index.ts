import fetch from 'cross-fetch';
import type { AnalyticsOptions, AuthenticationOptions } from '../interfaces';
import {
  NotAuthorizedError,
  RateLimitedError,
  AuthorNotAuthorizedError,
  RequestTimeoutError,
} from './errors';

interface RequestOptions {
  timeout?: number | null;
}

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
  private readonly _timeout: number = 30000; // 30 seconds default

  constructor(options: AnalyticsOptions) {
    this._baseUrl = options.clientOptions?.baseUrl || this._baseUrl;
    this._siteUuid = options.siteUuid;
    this._headers = this._extractHeaders(options.authentication, options.siteUuid);
    this._logErrors = options.logErrors || false;
    this._timeout = options.clientOptions?.timeout ?? this._timeout;
  }

  /**
   * Wraps a GET request to the Bento API and automatically adds the required
   * headers.
   *
   * @param endpoint string
   * @param payload object
   * @returns Promise\<T\>
   * */
  public async get<T>(
    endpoint: string,
    payload: Record<string, unknown> = {},
    requestOptions: RequestOptions = {}
  ): Promise<T> {
    const queryParameters = this._getQueryParameters(payload);
    const url = `${this._baseUrl}${endpoint}?${queryParameters}`;

    const timeoutMs =
      requestOptions.timeout === undefined ? this._timeout : requestOptions.timeout;
    const response = await this._fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: this._headers,
      },
      timeoutMs
    );

    return this._handleResponse<T>(response);
  }

  /**
   * Wraps a POST request to the Bento API and automatically adds the required
   * headers.
   *
   * @param endpoint string
   * @param payload object
   * @returns Promise\<T\>
   * */
  public async post<T>(
    endpoint: string,
    payload: Record<string, unknown> = {},
    requestOptions: RequestOptions = {}
  ): Promise<T> {
    const body = this._getBody(payload);
    const url = `${this._baseUrl}${endpoint}`;

    const timeoutMs =
      requestOptions.timeout === undefined ? this._timeout : requestOptions.timeout;
    const response = await this._fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'Content-Type': 'application/json',
        },
        body,
      },
      timeoutMs
    );

    return this._handleResponse<T>(response);
  }

  /**
   * Wraps a PATCH request to the Bento API and automatically adds the required
   * headers.
   *
   * @param endpoint string
   * @param payload object
   * @returns Promise\<T\>
   * */
  public async patch<T>(
    endpoint: string,
    payload: Record<string, unknown> = {},
    requestOptions: RequestOptions = {}
  ): Promise<T> {
    const body = this._getBody(payload);
    const url = `${this._baseUrl}${endpoint}`;

    const timeoutMs =
      requestOptions.timeout === undefined ? this._timeout : requestOptions.timeout;
    const response = await this._fetchWithTimeout(
      url,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'Content-Type': 'application/json',
        },
        body,
      },
      timeoutMs
    );

    return this._handleResponse<T>(response);
  }

  /**
   * Performs a fetch request with a configurable timeout.
   *
   * @param url The URL to fetch
   * @param options Fetch options
   * @returns Promise<Response>
   */
  private async _fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number | null
  ): Promise<Response> {
    if (timeout === null) {
      return fetch(url, options);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new RequestTimeoutError(`Request timed out after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handles the response from a fetch request, parsing JSON or throwing appropriate errors.
   *
   * @param response The fetch Response object
   * @returns Promise<T> The parsed response data
   */
  private async _handleResponse<T>(response: Response): Promise<T> {
    if (this._isSuccessfulStatus(response.status)) {
      try {
        const data = await response.json();
        return data as T;
      } catch {
        // If JSON parsing fails on a successful response, throw a descriptive error
        throw new Error(`[${response.status}] - Invalid JSON response from server`);
      }
    }

    throw await this._getErrorForResponse(response);
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
      if (value === undefined || value === null) continue;
      queryParameters.append(key, String(value));
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
    let json: Record<string, unknown> | null = null;

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
      return new AuthorNotAuthorizedError(json.error as string);
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
