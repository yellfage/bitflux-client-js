import { OutgoingMessageType } from './outgoing-message-type'

export abstract class OutgoingMessage {
  public readonly type: OutgoingMessageType

  public constructor(type: OutgoingMessageType) {
    this.type = type
  }
}
