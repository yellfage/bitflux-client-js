import type { Protocol, Transport } from '../communication'

export class CommunicationSettings {
  public readonly transports: Transport[]

  public readonly protocols: Protocol[]

  public constructor(transports: Transport[], protocols: Protocol[]) {
    this.transports = transports
    this.protocols = protocols
  }
}
