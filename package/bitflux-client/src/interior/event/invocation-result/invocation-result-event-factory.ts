import type { InvocationResultEvent } from '../../../event'

import type { Invocation } from '../../invocation'

export interface InvocationResultEventFactory {
  create<TResult>(
    result: TResult,
    invocation: Invocation<TResult>,
  ): InvocationResultEvent<TResult>
}
