import { ConnectingEvent } from './connecting-event'
import { ConnectedEvent } from './connected-event'
import { ReconnectingEvent } from './reconnecting-event'
import { ReconnectedEvent } from './reconnected-event'
import { DisconnectedEvent } from './disconnected-event'
import { TerminatingEvent } from './terminating-event'
import { TerminatedEvent } from './terminated-event'

export type Events = {
  connecting: (event: ConnectingEvent) => any
  connected: (event: ConnectedEvent) => any
  reconnecting: (event: ReconnectingEvent) => any
  reconnected: (event: ReconnectedEvent) => any
  disconnected: (event: DisconnectedEvent) => any
  terminating: (event: TerminatingEvent) => any
  terminated: (event: TerminatedEvent) => any
}
