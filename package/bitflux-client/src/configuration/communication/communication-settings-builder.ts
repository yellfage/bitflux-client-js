import type { ProtocolBuilder, TransportBuilder } from '../../communication'

import type { CommunicationSettings } from './communication-settings'

export interface CommunicationSettingsBuilder {
  addTransport(builder: TransportBuilder): this
  addProtocol(builder: ProtocolBuilder): this
  build(): CommunicationSettings
  clone(): CommunicationSettingsBuilder
}
