/**
 * Command Method Parameter Types
 */
export type AddTagParameters = {
  email: string;
  tagName: string;
};

export type RemoveTagParameters = {
  email: string;
  tagName: string;
};

export type AddFieldParameters<S> = {
  email: string;
  field: {
    key: keyof S;
    value: unknown;
  };
};

export type RemoveFieldParameters<S> = {
  email: string;
  fieldName: keyof S;
};

export type SubscribeParameters = {
  email: string;
};

export type UnsubscribeParameters = {
  email: string;
};

export type ChangeEmailParameters = {
  oldEmail: string;
  newEmail: string;
};
