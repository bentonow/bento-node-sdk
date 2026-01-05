import type { BaseEntity } from '../types';

/**
 * Embedded Email Template in Sequence
 */
export type SequenceEmailTemplate = {
  id: number;
  subject: string;
  stats: Record<string, unknown> | null;
};

/**
 * Core Sequence Types
 */
export type SequenceAttributes = {
  name: string;
  created_at: string;
  email_templates: SequenceEmailTemplate[];
};

export type Sequence = BaseEntity<SequenceAttributes>;
