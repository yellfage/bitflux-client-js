import type { InquiryEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

export interface InquiryEventFactory {
  create(target: Invocation): InquiryEvent
}
