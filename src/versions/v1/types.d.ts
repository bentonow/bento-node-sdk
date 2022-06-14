import { BaseEvent, PurchaseDetails } from '../../sdk/batch/events';

/**
 * API Method Parameter Types
 */
export type TagSubscriberParameters = {
  date?: Date;
  email: string;
  tagName: string;
};

export type AddSubscriberParameters<S> = {
  date?: Date;
  email: string;
  fields?: Partial<S>;
};

export type RemoveSubscriberParameters = {
  date?: Date;
  email: string;
};

export type TrackPurchaseParameters = {
  date?: Date;
  email: string;
  purchaseDetails: PurchaseDetails;
};

export type UpdateFieldsParameters<S> = {
  date?: Date;
  email: string;
  fields: Partial<S>;
};

export type TrackParameters<S, E> = BaseEvent<S, E> & { fields: Partial<S> };
