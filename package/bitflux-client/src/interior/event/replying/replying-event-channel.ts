import type { EventChannel } from '@yellfage/events'

import type { ReplyingEventHandler } from '../../../event'

export interface ReplyingEventChannel
  extends EventChannel<ReplyingEventHandler> {}
