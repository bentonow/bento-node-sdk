import type { AnalyticsOptions } from './sdk/interfaces';
import { BentoAPIV1 } from './versions/v1';

export class Analytics<S = { [key: string]: unknown }, E extends string = ''> {
  public readonly V1: BentoAPIV1<S, E>;

  constructor(options: AnalyticsOptions) {
    this.V1 = new BentoAPIV1(options);
  }
}

export * from './sdk/client/errors';
export * from './sdk/stats/types';
export type { CommandResult } from './sdk/commands/types';
export type {
  BatchBroadcastCreateResult,
  BroadcastFailure,
  CreatedBroadcast,
} from './sdk/broadcasts/types';
export type { ContentModerationResult } from './sdk/experimental/types';
export type { DeleteTagParameters, TagDeleteResult } from './sdk/tags/types';
export * from './sdk/contracts/endpoints';
export {
  getSequenceId,
  isSequenceId,
  toSequenceIdentity,
  toSequenceId,
} from './sdk/sequences/identity';
export type { SequenceId, SequenceIdentity } from './sdk/sequences/identity';
export type {
  CreateSequenceEmailParameters,
  GetSequencesParameters,
  Sequence,
  SequenceAttributes,
  SequenceDelayInterval,
  SequenceEmailTemplate,
} from './sdk/sequences/types';
export type {
  EmailTemplate,
  UpdateEmailTemplateParameters,
} from './sdk/email-templates/types';
