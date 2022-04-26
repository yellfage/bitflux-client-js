import type { OutgoingMessage } from '../../communication'

import type { State } from '../../state'

import type { BridgeEventHandlerMap } from './event'

export interface Bridge {
  readonly url: URL
  readonly state: State

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

  on<TEventName extends keyof BridgeEventHandlerMap>(
    eventName: TEventName,
    handler: BridgeEventHandlerMap[TEventName],
  ): BridgeEventHandlerMap[TEventName]

  off<TEventName extends keyof BridgeEventHandlerMap>(
    eventName: TEventName,
    handler: BridgeEventHandlerMap[TEventName],
  ): void
}
