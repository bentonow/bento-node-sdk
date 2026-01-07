export interface AnalyticsOptions {
  authentication: AuthenticationOptions;
  clientOptions?: ClientOptions;
  logErrors?: boolean;
  siteUuid: string;
}

export interface AuthenticationOptions {
  publishableKey: string;
  secretKey: string;
}

export interface ClientOptions {
  baseUrl?: string;
  /**
   * Request timeout in milliseconds. Defaults to 30000 (30 seconds).
   */
  timeout?: number;
}
