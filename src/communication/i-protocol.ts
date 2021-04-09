import { OutgoingMessage } from './outgoing-message'
import { IncomingMessage } from './incoming-message'

export interface IProtocol {
  readonly name: string

  serialize(
    message: OutgoingMessage
  ): string | ArrayBufferLike | Blob | ArrayBufferView

  deserialize(
    data: string | ArrayBufferLike | Blob | ArrayBufferView
  ): IncomingMessage
}
