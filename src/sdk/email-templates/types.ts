import type { BaseEntity } from '../types';

/**
 * Email Template Method Parameter Types
 */
export type GetEmailTemplateParameters = {
  id: number;
};

export type UpdateEmailTemplateParameters = {
  id: number;
  subject?: string;
  html?: string;
};

/**
 * Core Email Template Types
 */
export type EmailTemplateAttributes = {
  name: string;
  subject: string;
  html: string;
  created_at: string;
  stats: Record<string, unknown> | null;
};

export type EmailTemplate = BaseEntity<EmailTemplateAttributes>;
