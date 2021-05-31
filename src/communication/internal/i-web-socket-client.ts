import { WebSocketState } from './web-socket-state'
import { WebSocketCloseStatus } from '../../web-socket-close-status'

import { WebSocketOpenEventHandler } from './web-socket-open-event-handler'
import { WebSocketCloseEventHandler } from './web-socket-close-event-handler'
import { WebSocketMessageEventHandler } from './web-socket-message-event-handler'

export interface IWebSocketClient {
  url: string
  readonly state: WebSocketState
  readonly subProtocol: string | undefined

  onopen: WebSocketOpenEventHandler | null
  onclose: WebSocketCloseEventHandler | null
  onmessage: WebSocketMessageEventHandler | null

  start(url?: string): Promise<void>
  stop(status?: WebSocketCloseStatus, statusDescription?: string): Promise<void>
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
}
