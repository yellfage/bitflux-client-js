import type { Protocol, Transport } from '../communication'

export interface CommunicationSettings {
  readonly transports: Transport[]
  readonly protocols: Protocol[]
}
