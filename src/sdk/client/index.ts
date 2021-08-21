import fetch from 'isomorphic-fetch';
import { InternalServerError, NotAuthorizedError } from './errors';
import { AnalyticsOptions, AuthenticationOptions } from '../interfaces';

export class BentoClient {
  private readonly _headers: HeadersInit = {};
  private readonly _baseUrl: string = 'https://app.bentonow.com/api/v1';
  private readonly _siteUuid: string = '';

  constructor(options: AnalyticsOptions) {
    this._baseUrl = options.clientOptions?.baseUrl || this._baseUrl;
    this._siteUuid = options.siteUuid;
    this._headers = this._extractHeaders(options.authentication);
  }

  public get<T>(endpoint: string, payload: object = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const queryParameters = this._getQueryParameters(payload);

      fetch(`${this._baseUrl}${endpoint}?${queryParameters}`, {
        method: 'GET',
        headers: this._headers,
      })
        .then(result => {
          if (this._isSuccessfulStatus(result.status)) {
            return result.json();
          }

          throw this._getErrorForResponse(result);
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  public post<T>(endpoint: string, payload: object = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const body = this._getBody(payload);

      fetch(`${this._baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this._headers,
        body,
      })
        .then(result => result.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  private _extractHeaders(authentication: AuthenticationOptions) {
    const authenticationKey = Buffer.from(
      `${authentication.publishableKey}:${authentication.secretKey}`
    ).toString('base64');

    return {
      Authorization: `Basic ${authenticationKey}`,
    };
  }

  private _getBody(payload: object): string {
    return JSON.stringify({
      ...payload,
      site_uuid: this._siteUuid,
    });
  }

  private _getQueryParameters(payload: object): string {
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

  private _isSuccessfulStatus(statusCode: number): boolean {
    const validStatusCodes: number[] = [200, 201];

    return validStatusCodes.includes(statusCode);
  }

  private _getErrorForResponse(response: Response) {
    if (response.status === 401) return new NotAuthorizedError();
    return new InternalServerError();
  }
}
