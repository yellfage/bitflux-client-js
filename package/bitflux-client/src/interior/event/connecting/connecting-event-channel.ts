import type { EventChannel } from '@yellfage/events'

import type { ConnectingEventHandler } from '../../../event'

export interface ConnectingEventChannel
  extends EventChannel<ConnectingEventHandler> {}
