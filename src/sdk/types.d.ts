/**
 * Core Types
 */

export type BaseEntity<T> = {
  attributes: T;
  id: string;
  type: EntityType;
};
