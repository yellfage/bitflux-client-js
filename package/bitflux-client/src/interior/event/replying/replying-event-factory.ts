import type { ReplyingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

export interface ReplyingEventFactory {
  create(target: Invocation, result: unknown): ReplyingEvent
}
