import { BaseEntity } from '../types';

/**
 * Tag Method Parameter Types
 */
export type CreateTagParameters = {
  name: string;
};

/**
 * Core Tag Types
 */

export type TagAttributes = {
  created_at: string;
  discarded_at: string | null;
  name: string | null;
  site_id: number;
};

export type Tag = BaseEntity<TagAttributes>;
