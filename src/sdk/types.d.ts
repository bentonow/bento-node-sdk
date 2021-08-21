/**
 * Core Types
 */

export type BaseEntity<T> = {
  attributes: T;
  id: string;
  type: EntityType;
};

/**
 * Utility Types
 */
export type BrowserData = {
  height: string;
  user_agent: string;
  width: string;
};

export type IdentityData = {
  email: string;
};

export type LocationData = {
  city_name: string;
  continent_code: string;
  country_code2: string;
  country_code3: string;
  country_name: string;
  ip: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  real_region_name: string;
  region_name: string;
  request: string;
};

export type PageData = {
  host: string;
  path: string;
  protocol: string;
  referrer: string;
  url: string;
};
