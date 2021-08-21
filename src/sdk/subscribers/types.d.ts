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

export type Subscriber = {};
