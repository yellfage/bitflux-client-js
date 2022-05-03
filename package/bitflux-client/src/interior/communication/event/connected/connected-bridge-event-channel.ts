import type { EventChannel } from '@yellfage/events'

import type { ConnectedBridgeEventHandler } from './connected-bridge-event-handler'

export interface ConnectedBridgeEventChannel
  extends EventChannel<ConnectedBridgeEventHandler> {}
