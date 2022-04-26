import type { Protocol, Transport } from '../../../communication'

import type { CommunicationSettings } from '../../../configuration'

export class BasicCommunicationSettings implements CommunicationSettings {
  public readonly transports: Transport[]

  public readonly protocols: Protocol[]

  public constructor(transports: Transport[], protocols: Protocol[]) {
    this.transports = transports
    this.protocols = protocols
  }
}
