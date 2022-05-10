import type {
  LoggingSettings,
  LoggingSettingsBuilder,
} from '../../../configuration'

import type { LoggerBuilder } from '../../../logging'

import { BasicLoggerBuilder } from '../../../logging'

import { BasicLoggingSettings } from './basic-logging-settings'

export class BasicLoggingSettingsBuilder implements LoggingSettingsBuilder {
  private loggerBuilder: LoggerBuilder

  public constructor(loggerBuilder: LoggerBuilder = new BasicLoggerBuilder()) {
    this.loggerBuilder = loggerBuilder
  }

  public setLogger(builder: LoggerBuilder): this {
    this.loggerBuilder = builder

    return this
  }

  public build(): LoggingSettings {
    return new BasicLoggingSettings(this.loggerBuilder.build())
  }

  public clone(): LoggingSettingsBuilder {
    return new BasicLoggingSettingsBuilder(this.loggerBuilder)
  }
}
