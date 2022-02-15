import type { ProtocolBuilder, TransportBuilder } from '../communication'

import type { CommunicationSettings } from './communication-settings'

export interface CommunicationSettingsBuilder {
  addTransportBuilder(builder: TransportBuilder): this
  addProtocolBuilder(builder: ProtocolBuilder): this
  build(): CommunicationSettings
  clone(): CommunicationSettingsBuilder
}
