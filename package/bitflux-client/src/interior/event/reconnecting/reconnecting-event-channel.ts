import type { EventChannel } from '@yellfage/events'

import type { ReconnectingEventHandler } from '../../../event'

export interface ReconnectingEventChannel
  extends EventChannel<ReconnectingEventHandler> {}
