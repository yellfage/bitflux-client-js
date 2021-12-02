import type {
  IncomingMessage,
  OutgoingMessage,
  Protocol,
} from '@yellfage/wst-client'

export class JsonProtocol implements Protocol {
  public readonly name = 'json'

  public serialize(message: OutgoingMessage): string {
    return JSON.stringify(message)
  }

  public deserialize(data: string): IncomingMessage {
    return JSON.parse(data) as IncomingMessage
  }
}
