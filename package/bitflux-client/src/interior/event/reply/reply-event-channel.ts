import type { EventChannel } from '@yellfage/events'

import type { ReplyEventHandler } from '../../../event'

export interface ReplyEventChannel extends EventChannel<ReplyEventHandler> {}
