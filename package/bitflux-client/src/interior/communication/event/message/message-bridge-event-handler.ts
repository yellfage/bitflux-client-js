import type { MessageBridgeEvent } from './message-bridge-event'

export type MessageBridgeEventHandler = (event: MessageBridgeEvent) => unknown
