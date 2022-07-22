import type { AnalyticsOptions } from './sdk/interfaces';
import { BentoAPIV1 } from './versions/v1';

export class Analytics<S = { [key: string]: unknown }, E extends string = ''> {
  public readonly V1: BentoAPIV1<S, E>;

  constructor(options: AnalyticsOptions) {
    this.V1 = new BentoAPIV1(options);
  }
}

export * from './sdk/client/errors';
