import type { ProtocolBuilder, TransportBuilder } from '../../../communication'

import type {
  CommunicationSettings,
  CommunicationSettingsBuilder,
} from '../../../configuration'

import { BasicCommunicationSettings } from './basic-communication-settings'

export class BasicCommunicationSettingsBuilder
  implements CommunicationSettingsBuilder
{
  private readonly transportBuilders: TransportBuilder[]

  private readonly protocolBuilders: ProtocolBuilder[]

  public constructor()
  public constructor(
    transportBuilders: TransportBuilder[],
    protocolBuilders: ProtocolBuilder[],
  )
  public constructor(
    transportBuilders: TransportBuilder[] = [],
    protocolBuilders: ProtocolBuilder[] = [],
  ) {
    this.transportBuilders = transportBuilders
    this.protocolBuilders = protocolBuilders
  }

  public addTransportBuilder(builder: TransportBuilder): this {
    this.transportBuilders.push(builder)

    return this
  }

  public addProtocolBuilder(builder: ProtocolBuilder): this {
    this.protocolBuilders.push(builder)

    return this
  }

  public build(): CommunicationSettings {
    return new BasicCommunicationSettings(
      this.transportBuilders.map((builder) => builder.build()),
      this.protocolBuilders.map((builder) => builder.build()),
    )
  }

  public clone(): CommunicationSettingsBuilder {
    return new BasicCommunicationSettingsBuilder(
      this.transportBuilders.slice(),
      this.protocolBuilders.slice(),
    )
  }
}
