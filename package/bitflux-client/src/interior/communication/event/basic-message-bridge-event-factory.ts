import type { IncomingMessage } from '../../../communication'

import type { Bridge } from '../bridge'

import { BasicMessageBridgeEvent } from './basic-message-bridge-event'

import type { MessageBridgeEvent } from './message-bridge-event'

import type { MessageBridgeEventFactory } from './message-bridge-event-factory'

export class BasicMessageBridgeEventFactory
  implements MessageBridgeEventFactory
{
  public create(bridge: Bridge, message: IncomingMessage): MessageBridgeEvent {
    return new BasicMessageBridgeEvent(bridge, message)
  }
}
