import type { Sequence, SequenceEmailTemplate } from './types';

export type SequenceId = string & { readonly __brand: 'SequenceId' };

export type SequenceIdentity = {
  id: SequenceId | null;
  name: string;
  templateIds: readonly number[];
};

export type SequenceIdentitySource = Pick<Sequence, 'id'> & {
  attributes: Pick<Sequence['attributes'], 'name' | 'email_templates'> &
    Partial<Pick<Sequence['attributes'], 'prefix_id' | 'id'>>;
};

export function toSequenceId(value: string): SequenceId {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error('Sequence ID must be the non-empty id returned by list sequences.');
  }

  return normalized as SequenceId;
}

export function isSequenceId(value: string): boolean {
  return value.trim().length > 0;
}

export function getSequenceId(sequence: SequenceIdentitySource): SequenceId | null {
  const candidates = [sequence.id, sequence.attributes.id, sequence.attributes.prefix_id];

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const normalized = candidate.trim();
    if (isSequenceId(normalized)) {
      return normalized as SequenceId;
    }
  }

  return null;
}

function getTemplateIds(templates: readonly SequenceEmailTemplate[]): readonly number[] {
  return templates.map((template) => template.id);
}

export function toSequenceIdentity(sequence: SequenceIdentitySource): SequenceIdentity {
  return {
    id: getSequenceId(sequence),
    name: sequence.attributes.name,
    templateIds: getTemplateIds(sequence.attributes.email_templates),
  };
}
