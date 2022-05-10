import type { LoggerBuilder } from '../../logging'

import type { LoggingSettings } from './logging-settings'

export interface LoggingSettingsBuilder {
  setLogger(builder: LoggerBuilder): this
  build(): LoggingSettings
  clone(): LoggingSettingsBuilder
}
