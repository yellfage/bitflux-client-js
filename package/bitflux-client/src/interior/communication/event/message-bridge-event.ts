import type { IncomingMessage } from '../../../communication'

import type { BridgeEvent } from './bridge-event'

export interface MessageBridgeEvent extends BridgeEvent {
  readonly message: IncomingMessage
}
