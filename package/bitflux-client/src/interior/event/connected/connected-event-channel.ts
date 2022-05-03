import type { EventChannel } from '@yellfage/events'

import type { ConnectedEventHandler } from '../../../event'

export interface ConnectedEventChannel
  extends EventChannel<ConnectedEventHandler> {}
