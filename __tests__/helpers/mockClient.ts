import type { AnalyticsOptions } from '../../src/sdk/interfaces';

export const mockOptions: AnalyticsOptions = {
  siteUuid: 'test-site-uuid',
  authentication: {
    publishableKey: 'test-pub-key',
    secretKey: 'test-secret-key'
  },
  logErrors: true
};

export const mockSuccessResponse = {
  data: {
    id: 'test-id',
    type: 'visitors',
    attributes: {
      uuid: 'test-uuid',
      email: 'test@example.com',
      fields: null,
      cached_tag_ids: ['tag-123'],
      unsubscribed_at: null
    }
  }
};