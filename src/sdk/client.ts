import fetch from 'isomorphic-fetch';
import { AnalyticsOptions, AuthenticationOptions } from './interfaces';

export class BentoClient {
  private headers: HeadersInit = {};
  private baseUrl: string = 'https://app.bentonow.com/api/v1';
  private siteUuid: string = '';

  constructor(options: AnalyticsOptions) {
    this.baseUrl = options.clientOptions?.baseUrl || this.baseUrl;
    this.siteUuid = options.siteUuid;
    this.headers = this.extractHeaders(options.authentication);
  }

  public get(endpoint: string, payload: object = {}) {
    return new Promise((resolve, reject) => {
      const queryParameters = this.getQueryParameters(payload);

      fetch(`${this.baseUrl}${endpoint}?${queryParameters}`, {
        method: 'GET',
        headers: this.headers,
      })
        .then(result => result.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  public post(endpoint: string, payload: object = {}) {
    return new Promise((resolve, reject) => {
      const body = this.getBody(payload);

      fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body,
      })
        .then(result => result.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  private extractHeaders(authentication: AuthenticationOptions) {
    const authenticationKey = Buffer.from(
      `${authentication.publishableKey}:${authentication.privateKey}`
    ).toString('base64');

    return {
      Authorization: `Bearer ${authenticationKey}`,
    };
  }

  private getBody(payload: object): string {
    return JSON.stringify({
      ...payload,
      siteUuid: this.siteUuid,
    });
  }

  private getQueryParameters(payload: object): string {
    const body = {
      ...payload,
      siteUuid: this.siteUuid,
    };

    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      queryParameters.append(key, value);
    }

    return queryParameters.toString();
  }
}
