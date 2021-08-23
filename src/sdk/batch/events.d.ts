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
  date?: Date;
  details: PurchaseDetails;
  email: string;
  type: BentoEvents.PURCHASE | '$purchase';
};

export type SubscribeEvent<S> = {
  date?: Date;
  email: string;
  fields?: Partial<S>;
  type: BentoEvents.SUBSCRIBE | '$subscribe';
};

export type TagEvent = {
  date?: Date;
  details: {
    tag: string;
  };
  email: string;
  type: BentoEvents.TAG | '$tag';
};

export type UnsubscribeEvent = {
  date?: Date;
  email: string;
  type: BentoEvents.UNSUBSCRIBE | '$unsubscribe';
};

export type UpdateFieldsEvent<S> = {
  date?: Date;
  email: string;
  type: BentoEvents.UPDATE_FIELDS | '$update_fields';
  fields: Partial<S>;
};

export type InternalEvents<S> =
  | PurchaseEvent
  | SubscribeEvent<S>
  | TagEvent
  | UnsubscribeEvent
  | UpdateFieldsEvent<S>;

export type BaseEvent<E> = {
  date?: Date;
  details?: { [key: string]: any };
  email: string;
  /* eslint-disable */
  type: `${E}${string}`;
};

export type BentoEvent<S, E> = InternalEvents<S> | BaseEvent<E>;
