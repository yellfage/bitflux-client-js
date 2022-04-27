import type { InvocationEvent } from '../../../event'

import type { Invocation } from '../../invocation'

export interface InvocationEventFactory {
  create(invocation: Invocation<unknown>): InvocationEvent
}
