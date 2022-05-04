import type { EventPool } from '@yellfage/events'

import type { ReplyEventHandler } from './reply-event-handler'

export interface ReplyEventPool extends EventPool<ReplyEventHandler> {}
