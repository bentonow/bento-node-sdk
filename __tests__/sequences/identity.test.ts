import { describe, expect, test } from 'bun:test';
import {
  getSequenceId,
  isSequenceId,
  toSequenceIdentity,
  toSequenceId,
} from '../../src/sdk/sequences/identity';

describe('sequence identity helpers', () => {
  test('accepts non-empty sequence IDs returned by list sequences', () => {
    expect(isSequenceId('123')).toBe(true);
    expect(isSequenceId('sequence_abc123')).toBe(true);
    expect(toSequenceId('  123  ')).toBe('123');
  });

  test('rejects blank sequence IDs before HTTP', () => {
    expect(isSequenceId('   ')).toBe(false);
    expect(() => toSequenceId('   ')).toThrow(
      'Sequence ID must be the non-empty id returned by list sequences.'
    );
  });

  test('prefers the top-level id returned by list sequences', () => {
    const id = getSequenceId({
      id: '123',
      attributes: {
        name: 'Welcome',
        id: 'sequence_abc123',
        email_templates: [],
      },
    });

    expect(id).toBe('123');
  });

  test('falls back to attributes.id or prefix_id when top-level id is missing', () => {
    const id = getSequenceId({
      id: '',
      attributes: {
        name: 'Direct',
        id: '456',
        prefix_id: 'sequence_direct',
        email_templates: [],
      },
    });

    expect(id).toBe('456');
  });

  test('builds a SequenceIdentity with the create ID and template IDs', () => {
    const identity = toSequenceIdentity({
      id: '123',
      attributes: {
        name: 'Onboarding',
        email_templates: [
          { id: 10, subject: 'Welcome', stats: null },
          { id: 11, subject: 'Next step', stats: null },
        ],
      },
    });

    expect(identity).toEqual({
      id: '123',
      name: 'Onboarding',
      templateIds: [10, 11],
    });
  });
});
