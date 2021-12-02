import type {
  Protocol,
  ProtocolBuilder,
  Transport,
  TransportBuilder,
} from '../communication'

import { CommunicationSettings } from './communication-settings'

export class CommunicationSettingsBuilder {
  private readonly transports: Transport[] = []

  private readonly protocols: Protocol[] = []

  public addTransportBuilder(builder: TransportBuilder): this {
    this.transports.push(builder.build())

    return this
  }

  public addProtocolBuilder(builder: ProtocolBuilder): this {
    this.protocols.push(builder.build())

    return this
  }

  public build(): CommunicationSettings {
    return new CommunicationSettings(this.transports, this.protocols)
  }
}
