import type {
  ReconnectionDelaySchemeBuilder,
  ReconnectionControlBuilder,
} from '../../reconnection'

import type { ReconnectionSettings } from './reconnection-settings'

export interface ReconnectionSettingsBuilder {
  setControl(builder: ReconnectionControlBuilder): this
  setDelayScheme(builder: ReconnectionDelaySchemeBuilder): this
  build(): ReconnectionSettings
  clone(): ReconnectionSettingsBuilder
}
