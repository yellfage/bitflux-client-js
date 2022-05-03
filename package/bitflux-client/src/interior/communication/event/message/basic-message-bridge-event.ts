import type { IncomingMessage } from '../../../../communication'

import type { Bridge } from '../../bridge'

import { BasicBridgeEvent } from '../basic-bridge-event'

import type { MessageBridgeEvent } from './message-bridge-event'

export class BasicMessageBridgeEvent
  extends BasicBridgeEvent
  implements MessageBridgeEvent
{
  public readonly message: IncomingMessage

  public constructor(target: Bridge, message: IncomingMessage) {
    super(target)

    this.message = message
  }
}
