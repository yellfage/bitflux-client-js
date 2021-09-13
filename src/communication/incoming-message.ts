import type { IncomingMessageType } from './incoming-message-type'

export interface IncomingMessage {
  readonly type: IncomingMessageType
}
