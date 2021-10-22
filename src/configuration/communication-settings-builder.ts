import type { Protocol } from '../communication'

import { JsonProtocol } from '../communication'

import { CommunicationSettings } from './communication-settings'

export class CommunicationSettingsBuilder {
  private readonly protocols: Protocol[] = []

  public addProtocol(protocol: Protocol): this {
    this.protocols.push(protocol)

    return this
  }

  public build(): CommunicationSettings {
    if (!this.protocols.length) {
      this.protocols.push(new JsonProtocol())
    }

    return new CommunicationSettings(this.protocols)
  }
}
