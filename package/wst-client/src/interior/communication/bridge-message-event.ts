import type { IncomingMessage } from '../../communication'

import type { BridgeEvent } from './bridge-event'

export interface BridgeMessageEvent extends BridgeEvent {
  readonly message: IncomingMessage
}
