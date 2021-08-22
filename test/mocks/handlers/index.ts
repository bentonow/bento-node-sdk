import { handlers as batchHandlers } from './batch';
import { handlers as clientHandlers } from './client';
import { handlers as commandsHandlers } from './commands';
import { handlers as experimentalHandlers } from './experimental';
import { handlers as fieldsHandlers } from './fields';
import { handlers as formsHandlers } from './forms';
import { handlers as subscribersHandlers } from './subscribers';
import { handlers as tagsHandlers } from './tags';

export const handlers = [
  ...batchHandlers,
  ...clientHandlers,
  ...commandsHandlers,
  ...experimentalHandlers,
  ...fieldsHandlers,
  ...formsHandlers,
  ...subscribersHandlers,
  ...tagsHandlers,
];
