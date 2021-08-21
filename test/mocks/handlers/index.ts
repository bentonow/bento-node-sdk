import { handlers as clientHandlers } from './client';
import { handlers as subscribersHandlers } from './subscribers';
import { handlers as tagsHandlers } from './tags';

export const handlers = [
  ...clientHandlers,
  ...subscribersHandlers,
  ...tagsHandlers,
];
