import type { EventChannel } from '@yellfage/events'

import type { ConnectingBridgeEventHandler } from './connecting-bridge-event-handler'

export interface ConnectingBridgeEventChannel
  extends EventChannel<ConnectingBridgeEventHandler> {}
