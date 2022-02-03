import type { Protocol, Transport } from '../../communication'

export interface Agreement {
  readonly transport: Transport
  readonly protocol: Protocol
}
