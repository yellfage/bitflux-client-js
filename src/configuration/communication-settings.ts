import type { Protocol } from '../communication'

export class CommunicationSettings {
  public protocols: Protocol[]

  public constructor(protocols: Protocol[] = []) {
    this.protocols = protocols
  }
}
