/**
 * Core Enums
 */
export enum EntityType {
  TAGS = 'tags',
  VISITORS = 'visitors',
  VISITORS_FIELDS = 'visitors-fields',
}

/**
 * Core Types
 */

export type BaseEntity<T> = {
  attributes: T;
  id: string;
  type: EntityType;
};
