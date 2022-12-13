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

export type BatchImportEmail = {
  to: string;
  from: string;
  subject: string;
  html_body: string;
  transactional: boolean;
  personalizations?: { [key: string]: string };
};

export type BatchImportEmailsParameter = {
  emails: BatchImportEmail[];
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

export type BatchImportEmailsResponse = {
  results: number;
};
