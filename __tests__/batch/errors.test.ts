import { expect, test, describe } from 'bun:test';
import {
  TooFewSubscribersError,
  TooManySubscribersError,
  TooFewEventsError,
  TooManyEventsError,
  TooFewEmailsError,
  TooManyEmailsError
} from '../../src/sdk/batch/errors';

describe('Batch Errors', () => {
  test('creates TooFewSubscribersError with default message', () => {
    const error = new TooFewSubscribersError();
    expect(error.message).toBe('Too few subscribers');
    expect(error.name).toBe('TooFewSubscribersError');
  });

  test('creates TooFewSubscribersError with custom message', () => {
    const error = new TooFewSubscribersError('Custom message');
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('TooFewSubscribersError');
  });

  test('creates TooManySubscribersError with default message', () => {
    const error = new TooManySubscribersError();
    expect(error.message).toBe('Too many subscribers');
    expect(error.name).toBe('TooManySubscribersError');
  });

  test('creates TooManySubscribersError with custom message', () => {
    const error = new TooManySubscribersError('Custom message');
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('TooManySubscribersError');
  });

  test('creates TooFewEventsError with default message', () => {
    const error = new TooFewEventsError();
    expect(error.message).toBe('Too few events');
    expect(error.name).toBe('TooFewEventsError');
  });

  test('creates TooFewEventsError with custom message', () => {
    const error = new TooFewEventsError('Custom message');
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('TooFewEventsError');
  });

  test('creates TooManyEventsError with default message', () => {
    const error = new TooManyEventsError();
    expect(error.message).toBe('Too many events');
    expect(error.name).toBe('TooManyEventsError');
  });

  test('creates TooManyEventsError with custom message', () => {
    const error = new TooManyEventsError('Custom message');
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('TooManyEventsError');
  });

  test('creates TooFewEmailsError with default message', () => {
    const error = new TooFewEmailsError();
    expect(error.message).toBe('Too few emails');
    expect(error.name).toBe('TooFewEmailsError');
  });

  test('creates TooFewEmailsError with custom message', () => {
    const error = new TooFewEmailsError('Custom message');
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('TooFewEmailsError');
  });

  test('creates TooManyEmailsError with default message', () => {
    const error = new TooManyEmailsError();
    expect(error.message).toBe('Too many emails');
    expect(error.name).toBe('TooManyEmailsError');
  });

  test('creates TooManyEmailsError with custom message', () => {
    const error = new TooManyEmailsError('Custom message');
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('TooManyEmailsError');
  });
});