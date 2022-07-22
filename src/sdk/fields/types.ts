import type { BaseEntity } from '../types';

/**
 * Field Method Parameter Types
 */
export type CreateFieldParameters = {
  key: string;
};

/**
 * Core Field Types
 */

export type FieldAttributes = {
  created_at: string;
  key: string;
  name: string;
  whitelisted: boolean | null;
};

export type Field = BaseEntity<FieldAttributes>;
