import type { Logger } from '../logging'

export class LoggingSettings {
  public readonly logger: Logger

  public constructor(logger: Logger) {
    this.logger = logger
  }
}
