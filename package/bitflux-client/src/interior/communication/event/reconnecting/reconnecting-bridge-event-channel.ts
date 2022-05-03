import type { EventChannel } from '@yellfage/events'

import type { ReconnectingBridgeEventHandler } from './reconnecting-bridge-event-handler'

export interface ReconnectingBridgeEventChannel
  extends EventChannel<ReconnectingBridgeEventHandler> {}
