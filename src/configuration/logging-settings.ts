import type { Logger } from '../logging'

import { DefaultLogger, LogLevel } from '../logging'

export class LoggingSettings {
  public logger: Logger

  public constructor(logger: Logger = new DefaultLogger(LogLevel.Trace)) {
    this.logger = logger
  }
}
