import { DefaultLogger, Logger, LogLevel } from '../logging'

export class LoggingSettings {
  public logger: Logger

  public constructor(logger: Logger = new DefaultLogger(LogLevel.Trace)) {
    this.logger = logger
  }
}
