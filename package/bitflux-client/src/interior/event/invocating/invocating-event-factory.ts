import type { InvocatingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

export interface InvocatingEventFactory {
  create(target: Invocation): InvocatingEvent
}
