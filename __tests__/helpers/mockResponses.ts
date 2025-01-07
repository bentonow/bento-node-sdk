import { DataResponse } from '../../src/sdk/client/types';
import { Subscriber } from '../../src/sdk/subscribers/types';
import { EntityType } from '../../src/sdk/enums';

export const mockSubscriberResponse = (email: string, tagIds: string[] = []): DataResponse<Subscriber<any>> => ({
  data: {
    id: 'test-id',
    type: EntityType.VISITORS,
    attributes: {
      uuid: 'test-uuid',
      email,
      fields: null,
      cached_tag_ids: tagIds,
      unsubscribed_at: null
    }
  }
});

export const mockErrorResponse = (status: number, message: string) => ({
  status,
  ok: false,
  json: () => Promise.resolve({ error: message }),
  text: () => Promise.resolve(message),
  headers: new Headers({
    'Content-Type': 'application/json'
  })
});