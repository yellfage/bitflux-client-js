import type { EventChannel } from '@yellfage/events'

import type { DisconnectingBridgeEventHandler } from './disconnecting-bridge-event-handler'

export interface DisconnectingBridgeEventChannel
  extends EventChannel<DisconnectingBridgeEventHandler> {}
