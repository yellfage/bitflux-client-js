import { IProtocol } from './i-protocol'

import { IncomingMessage } from './incoming-message'
import { OutgoingMessage } from './outgoing-message'

export class JsonProtocol implements IProtocol {
  public readonly name: string

  public constructor() {
    this.name = 'yellfage.wst.json'
  }

  public serialize(message: OutgoingMessage): string {
    return JSON.stringify(message)
  }

  public deserialize(data: string): IncomingMessage {
    return JSON.parse(data) as IncomingMessage
  }
}
