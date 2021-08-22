import { BaseEntity } from '../types';

/**
 * Experimental Method Parameter Types
 */
export type ValidateEmailParameters = {
  email: string;
  ip?: string;
  name?: string;
  userAgent?: string;
};

/**
 * Experimental Method Response Types
 */
export type ValidateEmailResponse = {
  valid: boolean;
};
