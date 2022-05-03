import type { EventChannel } from '@yellfage/events'

import type { InvocationEventHandler } from '../../../event'

export interface InvocationEventChannel
  extends EventChannel<InvocationEventHandler> {}
