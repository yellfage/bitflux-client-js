import type { EventChannel } from '@yellfage/events'

import type { InvocationResultEventHandler } from '../../../event'

export interface InvocationResultEventChannel
  extends EventChannel<InvocationResultEventHandler> {}
