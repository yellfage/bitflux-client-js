import type { Protocol } from '../communication'

export class CommunicationSettings {
  public readonly protocols: Protocol[]

  public constructor(protocols: Protocol[]) {
    this.protocols = protocols
  }
}
