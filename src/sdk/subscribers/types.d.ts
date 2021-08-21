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
 * Subscriber Enums
 */
export enum SubscriberType {
  VISITORS = 'visitors',
}

/**
 * Core Subscriber Types
 */

export type SubscriberAttributes<S> = {
  uuid: string;
  email: string;
  fields: S | null;
  cached_tag_ids: string[];
  unsubscribed_at: string | null;
};

export type Subscriber<S> = {
  id: string;
  type: SubscriberType;
  attributes: SubscriberAttributes<S>;
};

export type GetSubscribersResult<S> = {
  data: Subscriber<S>;
};
