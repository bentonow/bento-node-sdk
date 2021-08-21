import { BaseEntity } from '../types';

/**
 * Subscriber Method Parameter Types
 */
export type GetSubscribersParameters =
  | {
      email?: never;
      uuid: string;
    }
  | {
      email: string;
      uuid?: never;
    }
  | never;

export type CreateSubscriberParameters = {
  email: string;
};

/**
 * Core Subscriber Types
 */

export type SubscriberAttributes<S> = {
  cached_tag_ids: string[];
  email: string;
  fields: S | null;
  unsubscribed_at: string | null;
  uuid: string;
};

export type Subscriber<S> = BaseEntity<SubscriberAttributes<S>>;

export type GetSubscribersResult<S> = {
  data: Subscriber<S>;
};
