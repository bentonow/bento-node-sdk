import type { BaseEntity } from '../types';
import type { EmailTemplate } from '../email-templates/types';

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

export type SequenceDelayInterval = 'minutes' | 'hours' | 'days' | 'months';

export type GetSequencesParameters = {
  page?: number;
};

export type CreateSequenceEmailParameters = {
  subject: string;
  html: string;
  inbox_snippet?: string;
  delay_interval?: SequenceDelayInterval;
  delay_interval_count?: number;
  editor_choice?: string;
  cc?: string;
  bcc?: string;
  to?: string;
};

export type CreateSequenceEmailResponse = EmailTemplate | null;
