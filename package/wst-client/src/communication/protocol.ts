import type { IncomingMessage } from './incoming-message'

import type { OutgoingMessage } from './outgoing-message'

export interface Protocol {
  readonly name: string

  serialize(message: OutgoingMessage): string

  deserialize(data: string): IncomingMessage
}
