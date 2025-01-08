import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';
import { TooFewEmailsError, TooManyEmailsError } from '../../src/sdk/batch/errors';

describe('BentoBatch - sendTransactionalEmails', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  test('successfully sends a single email', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.sendTransactionalEmails({
      emails: [{
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Test Email',
        html_body: '<p>Hello World</p>',
        transactional: true
      }]
    });

    expect(result).toBe(1);
  });

  test('successfully sends multiple emails', async () => {
    setupMockFetch({ results: 2 });

    const result = await analytics.V1.Batch.sendTransactionalEmails({
      emails: [
        {
          to: 'recipient1@example.com',
          from: 'sender@example.com',
          subject: 'Test Email 1',
          html_body: '<p>Hello World 1</p>',
          transactional: true
        },
        {
          to: 'recipient2@example.com',
          from: 'sender@example.com',
          subject: 'Test Email 2',
          html_body: '<p>Hello World 2</p>',
          transactional: true
        }
      ]
    });

    expect(result).toBe(2);
  });

  test('successfully sends email with personalizations', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.sendTransactionalEmails({
      emails: [{
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Welcome {{ name }}',
        html_body: '<p>Hello {{ name }}, your order number is {{ order_id }}</p>',
        transactional: true,
        personalizations: {
          name: 'John Doe',
          order_id: '123456'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('throws error when no emails provided', async () => {
    expect(
      analytics.V1.Batch.sendTransactionalEmails({
        emails: [],
      })
    ).rejects.toThrow(TooFewEmailsError);
  });

  test('throws error when too many emails provided', async () => {
    // Create array of 101 emails (exceeding 100 limit)
    const tooManyEmails = Array.from({ length: 101 }, () => ({
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      html_body: '<p>Hello World</p>',
      transactional: true
    }));

    expect(
      analytics.V1.Batch.sendTransactionalEmails({
        emails: tooManyEmails,
      })
    ).rejects.toThrow(TooManyEmailsError);
  });

  test('handles server error gracefully', async () => {
    setupMockFetch({ error: 'Server Error' }, 500);

    expect(
      analytics.V1.Batch.sendTransactionalEmails({
        emails: [
          {
            to: 'recipient@example.com',
            from: 'sender@example.com',
            subject: 'Test Email',
            html_body: '<p>Hello World</p>',
            transactional: true,
          },
        ],
      })
    ).rejects.toThrow();
  });

  test('handles email with all possible fields', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.sendTransactionalEmails({
      emails: [{
        to: 'recipient@example.com',
        from: 'Sender Name <sender@example.com>',
        subject: 'Complete Test Email',
        html_body: '<div><h1>Full Test</h1><p>With all fields</p></div>',
        transactional: true,
        personalizations: {
          name: 'John Doe',
          company: 'Test Co',
          id: 12345,
          verified: true,
          score: 95.5
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('handles emails with unicode characters', async () => {
    setupMockFetch({ results: 1 });

    const result = await analytics.V1.Batch.sendTransactionalEmails({
      emails: [{
        to: 'recipient@例子.com',
        from: '送信者 <sender@example.com>',
        subject: 'Test メール',
        html_body: '<p>こんにちは、世界！</p>',
        transactional: true,
        personalizations: {
          name: '山田太郎'
        }
      }]
    });

    expect(result).toBe(1);
  });

  test('handles batch close to limit', async () => {
    // Create array of 100 emails (at limit)
    const maxEmails = Array.from({ length: 100 }, (_, i) => ({
      to: `recipient${i}@example.com`,
      from: 'sender@example.com',
      subject: `Test Email ${i}`,
      html_body: `<p>Hello World ${i}</p>`,
      transactional: true
    }));

    setupMockFetch({ results: 100 });

    const result = await analytics.V1.Batch.sendTransactionalEmails({
      emails: maxEmails
    });

    expect(result).toBe(100);
  });
});