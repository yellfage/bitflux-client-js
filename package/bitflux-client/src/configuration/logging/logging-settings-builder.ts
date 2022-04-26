import type { LoggerBuilder } from '../../logging'

import type { LoggingSettings } from './logging-settings'

export interface LoggingSettingsBuilder {
  setLoggerBuilder(builder: LoggerBuilder): this
  build(): LoggingSettings
  clone(): LoggingSettingsBuilder
}
