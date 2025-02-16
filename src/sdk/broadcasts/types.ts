import type { BaseEntity } from '../types';

export type BroadcastType = 'plain' | 'html' | 'markdown';

export type ContactData = {
  name: string;
  email: string;
};

export type BroadcastAttributes = {
  name: string;
  subject: string;
  content: string;
  type: BroadcastType;
  from: ContactData;
  inclusive_tags?: string;
  exclusive_tags?: string;
  segment_id?: string;
  batch_size_per_hour: number;
  created_at: string;
};

export type Broadcast = BaseEntity<BroadcastAttributes>;

export type CreateBroadcastInput = Omit<BroadcastAttributes, 'created_at'>;

export type EmailData = {
  to: string;
  from: string;
  subject: string;
  html_body: string;
  transactional: boolean;
  personalizations?: Record<string, string | number | boolean>;
};