import type { BentoEvent } from './events';

/**
 * Batch Method Parameter Types
 */
export type BatchImportSubscribersParameter<S> = {
  subscribers: ({
    email: string;
  } & Partial<S>)[];
};

export type BatchImportEventsParameter<S, E extends string> = {
  events: BentoEvent<S, E>[];
};

/**
 * Batch Method Response Types
 */
export type BatchImportSubscribersResponse = {
  results: number;
};

export type BatchImportEventsResponse = {
  results: number;
};
