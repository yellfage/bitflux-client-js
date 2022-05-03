import type { EventChannel } from '@yellfage/events'

import type { DisconnectedEventHandler } from '../../../event'

export interface DisconnectedEventChannel
  extends EventChannel<DisconnectedEventHandler> {}
