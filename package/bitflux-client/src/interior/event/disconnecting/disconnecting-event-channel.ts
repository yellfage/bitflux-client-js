import type { EventChannel } from '@yellfage/events'

import type { DisconnectingEventHandler } from '../../../event'

export interface DisconnectingEventChannel
  extends EventChannel<DisconnectingEventHandler> {}
