import { DefaultLogger, Logger, LogLevel } from '../logging'

export class LoggingSettings {
  public logger: Logger

  public constructor(logger: Logger = new DefaultLogger(LogLevel.Trace)) {
    this.logger = logger
  }

  public static validate(settings: LoggingSettings): void {
    if (settings.logger == null) {
      throw TypeError(
        'Invalid logging settings: the "logger" field cannot be a null or undefined'
      )
    }
  }
}
