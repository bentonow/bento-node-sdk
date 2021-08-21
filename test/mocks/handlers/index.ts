import { handlers as clientHandlers } from './client';
import { handlers as commandsHandlers } from './commands';
import { handlers as fieldsHandlers } from './fields';
import { handlers as subscribersHandlers } from './subscribers';
import { handlers as tagsHandlers } from './tags';

export const handlers = [
  ...clientHandlers,
  ...commandsHandlers,
  ...fieldsHandlers,
  ...subscribersHandlers,
  ...tagsHandlers,
];
