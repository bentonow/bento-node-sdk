import { BentoEvents } from './enums';

export type PurchaseItem = {
  product_sku?: string;
  product_name?: string;
  quantity?: number;
  product_price?: number;
  product_id?: string;
} & { [key: string]: string };

export type PurchaseDetails = {
  unique: {
    key: string | number;
  };
  value: {
    currency: string;
    amount: number;
  };
  cart?: PurchaseItem[];
};

export type PurchaseEvent = {
  details: PurchaseDetails;
  email: string;
  type: BentoEvents.PURCHASE | '$purchase';
};

export type SubscribeEvent = {
  email: string;
  type: BentoEvents.SUBSCRIBE | '$subscribe';
};

export type TagEvent = {
  details: {
    tag: string;
  };
  email: string;
  type: BentoEvents.TAG | '$tag';
};

export type UnsubscribeEvent = {
  email: string;
  type: BentoEvents.UNSUBSCRIBE | '$unsubscribe';
};

export type InternalEvents =
  | PurchaseEvent
  | SubscribeEvent
  | TagEvent
  | UnsubscribeEvent;

export type BaseEvent<S, E> = {
  details?: { [key: string]: any };
  email: string;
  fields?: S;
  page?: { [key: string]: any };
  type: `${E}${string}`;
};

export type BentoEvent<S, E> = InternalEvents | BaseEvent<S, E>;
