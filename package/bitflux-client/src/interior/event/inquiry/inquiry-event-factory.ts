import type { InvocationEvent } from '../../../event'

import type { Invocation } from '../../invocation'

export interface InquiryEventFactory {
  create(target: Invocation<unknown>): InvocationEvent
}
