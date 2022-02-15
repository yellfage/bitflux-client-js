import type {
  ReconnectionDelaySchemeBuilder,
  ReconnectionControlBuilder,
} from '../reconnection'

import type { ReconnectionSettings } from './reconnection-settings'

export interface ReconnectionSettingsBuilder {
  setControlBuilder(builder: ReconnectionControlBuilder): this
  setDelaySchemeBuilder(builder: ReconnectionDelaySchemeBuilder): this
  build(): ReconnectionSettings
  clone(): ReconnectionSettingsBuilder
}
