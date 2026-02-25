import type { BaseEntity } from '../types';

/**
 * Embedded Email Template in Workflow
 */
export type WorkflowEmailTemplate = {
  id: number;
  subject: string;
  stats: Record<string, unknown> | null;
};

/**
 * Core Workflow Types
 */
export type WorkflowAttributes = {
  name: string;
  created_at: string;
  email_templates: WorkflowEmailTemplate[];
};

export type Workflow = BaseEntity<WorkflowAttributes>;

export type GetWorkflowsParameters = {
  page?: number;
};
