import type { ReplyEvent } from '../../../event'

import type { Invocation } from '../../invocation'

export interface ReplyEventFactory {
  create<TResult>(
    target: Invocation<TResult>,
    result: TResult,
  ): ReplyEvent<TResult>
}
