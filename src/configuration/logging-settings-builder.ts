import type { Logger } from '../logging'

import { DefaultLogger, LogLevel } from '../logging'

import { LoggingSettings } from './logging-settings'

export class LoggingSettingsBuilder {
  private logger: Logger = new DefaultLogger(LogLevel.Trace)

  public setLogger(logger: Logger): this {
    this.logger = logger

    return this
  }

  public build(): LoggingSettings {
    return new LoggingSettings(this.logger)
  }
}
