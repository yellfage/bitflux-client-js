import type { EventPool } from '@yellfage/events'

import type { ReplyingEventHandler } from './replying-event-handler'

export interface ReplyingEventPool extends EventPool<ReplyingEventHandler> {}
