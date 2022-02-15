import type {
  LoggingSettings,
  LoggingSettingsBuilder,
} from '../../configuration'

import type { LoggerBuilder } from '../../logging'

import { ConsoleLoggerBuilder } from '../../logging'

import { BasicLoggingSettings } from './basic-logging-settings'

export class BasicLoggingSettingsBuilder implements LoggingSettingsBuilder {
  private loggerBuilder: LoggerBuilder

  public constructor(
    loggerBuilder: LoggerBuilder = new ConsoleLoggerBuilder(),
  ) {
    this.loggerBuilder = loggerBuilder
  }

  public setLoggerBuilder(builder: LoggerBuilder): this {
    this.loggerBuilder = builder

    return this
  }

  public build(): LoggingSettings {
    return new BasicLoggingSettings(this.loggerBuilder.build())
  }

  public clone(): LoggingSettingsBuilder {
    return new BasicLoggingSettingsBuilder(this.loggerBuilder.clone())
  }
}