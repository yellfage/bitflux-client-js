import type { InquiryEvent } from '../../../event'

import { BasicInvocationEvent } from '../basic-invocation-event'

export class BasicInquiryEvent
  extends BasicInvocationEvent
  implements InquiryEvent {}
