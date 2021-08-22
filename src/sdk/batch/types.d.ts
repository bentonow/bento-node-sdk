import { BaseEntity, LocationData } from '../types';

/**
 * Batch Method Parameter Types
 */
export type BatchImportSubscribersParameter<S> = {
  subscribers: ({
    email: string;
  } & Partial<S>)[];
};

/**
 * Batch Method Response Types
 */
export type BatchImportSubscribersResponse = {
  results: number;
};
