/**
 * Core Enums
 */
export enum EntityType {
  TAGS = 'tags',
  VISITORS = 'visitors',
}

/**
 * Core Types
 */

export type BaseEntity<T> = {
  attributes: T;
  id: string;
  type: EntityType;
};
