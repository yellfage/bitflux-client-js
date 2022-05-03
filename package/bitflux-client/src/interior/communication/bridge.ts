import type { OutgoingMessage } from '../../communication'

import type { State } from '../../state'

import type {
  ConnectedBridgeEventPool,
  ConnectingBridgeEventPool,
  DisconnectedBridgeEventPool,
  DisconnectingBridgeEventPool,
  MessageBridgeEventPool,
  ReconnectingBridgeEventPool,
} from './event'

export interface Bridge {
  readonly url: URL
  readonly state: State

  readonly connecting: ConnectingBridgeEventPool
  readonly connected: ConnectedBridgeEventPool
  readonly disconnecting: DisconnectingBridgeEventPool
  readonly disconnected: DisconnectedBridgeEventPool
  readonly reconnecting: ReconnectingBridgeEventPool
  readonly message: MessageBridgeEventPool

  /**
   * @throws {@link AbortError}
   */
  connect(url?: string | URL): Promise<void>
  /**
   * @throws {@link AbortError}
   */
  reconnect(url?: string | URL): Promise<void>
  /**
   * @throws {@link AbortError}
   */
  disconnect(reason?: string): Promise<void>

  send(message: OutgoingMessage): void
}
