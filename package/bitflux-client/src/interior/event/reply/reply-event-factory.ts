import type { ReplyEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

export interface ReplyEventFactory {
  create(target: Invocation, result: unknown): ReplyEvent
}
