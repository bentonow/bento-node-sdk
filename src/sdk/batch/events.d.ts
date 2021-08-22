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

export type UpdateFieldsEvent<S> = {
  email: string;
  type: BentoEvents.UPDATE_FIELDS | '$update_fields';
  fields: Partial<S>;
};

export type InternalEvents<S> =
  | PurchaseEvent
  | SubscribeEvent
  | TagEvent
  | UnsubscribeEvent
  | UpdateFieldsEvent<S>;

export type BaseEvent<E> = {
  details?: { [key: string]: any };
  email: string;
  /* eslint-disable */
  type: `${E}${string}`;
};

export type BentoEvent<S, E> = InternalEvents<S> | BaseEvent<E>;
