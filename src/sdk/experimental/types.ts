import type { LocationData } from '../types';

/**
 * Experimental Method Parameter Types
 */
export type ValidateEmailParameters = {
  email: string;
  ip?: string;
  name?: string;
  userAgent?: string;
};

export type GuessGenderParameters = {
  name: string;
};

export type GeolocateParameters = {
  ip: string;
};

export type BlacklistParameters =
  | {
      domain: string;
      ip?: never;
    }
  | {
      domain?: never;
      ip: string;
    };

/**
 * Experimental Method Response Types
 */
export type ValidateEmailResponse = {
  valid: boolean;
};

export type GuessGenderResponse = {
  confidence: number | null;
  gender: string | null;
};

export type GeolocateResponse = Partial<LocationData>;

export type BlacklistResponse = {
  description: string;
  query: string;
  results: { [key: string]: boolean };
};
