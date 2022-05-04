import type { EventPool } from '@yellfage/events'

import type { InquiryEventHandler } from './inquiry-event-handler'

export interface InquiryEventPool extends EventPool<InquiryEventHandler> {}
