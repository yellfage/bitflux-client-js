import type { EventChannel } from '@yellfage/events'

import type { InvocatingEventHandler } from '../../../event'

export interface InvocatingEventChannel
  extends EventChannel<InvocatingEventHandler> {}
