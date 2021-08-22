import { BaseEntity, LocationData } from '../types';

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

/**
 * Experimental Method Response Types
 */
export type ValidateEmailResponse = {
  valid: boolean;
};

export type GuessGenderResponse = {
  confidence: number;
  gender: string | null;
};

export type GeolocateResponse = Partial<LocationData>;
