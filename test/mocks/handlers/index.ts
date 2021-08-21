import { handlers as subscribersHandlers } from './subscribers';
import { handlers as clientHandlers } from './client';

export const handlers = [...subscribersHandlers, ...clientHandlers];
