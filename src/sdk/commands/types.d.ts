import { BaseEntity } from '../types';

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
    value: any;
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
