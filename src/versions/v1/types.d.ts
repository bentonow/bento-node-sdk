import { BaseEntity } from '../types';
import { BentoEvents } from './enums';
import { BentoEvent } from './events';

/**
 * API Method Parameter Types
 */
export type TagSubscriberParameters = {
  email: string;
  tagName: string;
};

export type AddSubscriberParameters = {
  email: string;
};

/**
 * API Method Return Types
 */
export type TagSubscriberResponse = {
  success: boolean;
};

export type AddSubscriberResponse = {
  success: boolean;
};
