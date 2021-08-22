import { BaseEvent, PurchaseDetails } from '../../sdk/batch/events';
import { BaseEntity } from '../types';
import { BentoEvents } from './enums';
import { BentoEvent } from './events';

/**
 * API Method Parameter Types
 */
export type TagSubscriberParameters = {
  email: string;
  tagName: string;
};

export type AddSubscriberParameters = {
  email: string;
};

export type RemoveSubscriberParameters = {
  email: string;
};

export type TrackPurchaseParameters = {
  email: string;
  purchaseDetails: PurchaseDetails;
};

export type UpdateFieldsParameters<S> = {
  email: string;
  fields: S;
};

export type TrackParameters<S, E> = BaseEvent<S, E>;
