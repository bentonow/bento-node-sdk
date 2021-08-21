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

export type AddFieldParameters = {
  email: string;
  field: {
    key: string;
    value: string;
  };
};
