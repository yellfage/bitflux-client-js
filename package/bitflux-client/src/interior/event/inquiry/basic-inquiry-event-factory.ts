import type { InquiryEvent } from '../../../event'

import type { Invocation } from '../../invocation'

import { BasicInquiryEvent } from './basic-inquiry-event'

import type { InquiryEventFactory } from './inquiry-event-factory'

export class BasicInquiryEventFactory implements InquiryEventFactory {
  public create(target: Invocation<unknown>): InquiryEvent {
    return new BasicInquiryEvent(target)
  }
}
