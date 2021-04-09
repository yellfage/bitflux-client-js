import { ILogger } from '../../i-logger'
import { LoggingSettings } from '../logging-settings'

import { LogLevel } from '../../log-level'

import { DefaultLogger } from '../../default-logger'

export class DefaultLoggingSettings implements LoggingSettings {
  public logger: ILogger

  public constructor() {
    this.logger = new DefaultLogger(LogLevel.Debug)
  }
}
