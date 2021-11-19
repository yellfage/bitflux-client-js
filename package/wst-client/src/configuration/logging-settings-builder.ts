import type { LoggerBuilder } from '../logging'

import { ConsoleLoggerBuilder } from '../logging'

import { LoggingSettings } from './logging-settings'

export class LoggingSettingsBuilder {
  private loggerBuilder: LoggerBuilder = new ConsoleLoggerBuilder()

  public setLoggerBuilder(builder: LoggerBuilder): this {
    this.loggerBuilder = builder

    return this
  }

  public build(): LoggingSettings {
    return new LoggingSettings(this.loggerBuilder.build())
  }
}
