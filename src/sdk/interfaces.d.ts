export interface AnalyticsOptions {
  authentication: AuthenticationOptions;
  clientOptions?: ClientOptions;
  siteUuid: string;
}

export interface AuthenticationOptions {
  publishableKey: string;
  secretKey: string;
}

export interface ClientOptions {
  baseUrl?: string;
}
