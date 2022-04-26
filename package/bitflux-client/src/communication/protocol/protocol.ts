import type { IncomingMessage, OutgoingMessage } from '../message'

export interface Protocol {
  readonly name: string

  serialize(message: OutgoingMessage): string

  deserialize(data: string): IncomingMessage
}
