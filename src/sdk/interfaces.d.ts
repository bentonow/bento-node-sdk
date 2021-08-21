export interface AnalyticsOptions {
  authentication: AuthenticationOptions;
  clientOptions?: ClientOptions;
  siteUuid: string;
}

export interface AuthenticationOptions {
  publishableKey: string;
  privateKey: string;
}

export interface ClientOptions {
  baseUrl?: string;
}
