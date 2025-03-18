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

export type BlacklistCheckInput = {
  domain?: string;
  ipAddress?: string;
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

export type BlacklistResult = {
  description: string;
  query: string;
  results: Record<string, boolean>;
};

export type ContentModerationResult = {
  flagged: boolean;
  categories: {
    hate: boolean;
    'hate/threatening': boolean;
    'self-harm': boolean;
    sexual: boolean;
    'sexual/minors': boolean;
    violence: boolean;
    'violence/graphic': boolean;
  };
  category_scores: {
    hate: number;
    'hate/threatening': number;
    'self-harm': number;
    sexual: number;
    'sexual/minors': number;
    violence: number;
    'violence/graphic': number;
  };
};
