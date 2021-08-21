type GetSubscribersByUUID = {
  email?: never;
  uuid: string;
};

type GetSubscribersByEmail = {
  email: string;
  uuid?: never;
};

export type GetSubscribersParameters =
  | GetSubscribersByUUID
  | GetSubscribersByEmail
  | never;

export type SubscriberAttributes<S> = {
  uuid: string;
  email: string;
  fields: S;
  cached_tag_ids: string[];
  unsubscribed_at: string | null;
};

export type Subscriber<S> = {
  id: string;
  type: string;
  attributes: SubscriberAttributes<S>;
};

export type GetSubscribersResult<S> = {
  data: Subscriber<S>;
};
