import type {
  ConnectedEventPool,
  ConnectingEventPool,
  DisconnectedEventPool,
  DisconnectingEventPool,
  InquiryEventPool,
  ReconnectingEventPool,
  ReplyEventPool,
  RetryEventPool,
} from './event'

import type { InvocationBuilder, InvocationHandler } from './invocation'

import type { ClientPluginBuilder } from './plugin'

import type { State } from './state'

export interface BitfluxClient {
  readonly url: URL
  readonly state: State

  readonly connecting: ConnectingEventPool
  readonly connected: ConnectedEventPool
  readonly disconnecting: DisconnectingEventPool
  readonly disconnected: DisconnectedEventPool
  readonly reconnecting: ReconnectingEventPool

  readonly inquiry: InquiryEventPool
  readonly reply: ReplyEventPool
  readonly retry: RetryEventPool

  use(builder: ClientPluginBuilder): this

  map(handlerName: string, handler: InvocationHandler): this

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

  invoke<TResult>(
    handlerName: string,
    ...args: unknown[]
  ): InvocationBuilder<TResult>

  notify(handlerName: string, ...args: unknown[]): InvocationBuilder<void>
}
