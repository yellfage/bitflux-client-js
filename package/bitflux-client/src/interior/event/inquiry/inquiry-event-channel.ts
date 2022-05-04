import type { EventChannel } from '@yellfage/events'

import type { InquiryEventHandler } from '../../../event'

export interface InquiryEventChannel
  extends EventChannel<InquiryEventHandler> {}
