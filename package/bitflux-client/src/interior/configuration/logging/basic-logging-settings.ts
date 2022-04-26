import type { LoggingSettings } from '../../../configuration'

import type { Logger } from '../../../logging'

export class BasicLoggingSettings implements LoggingSettings {
  public readonly logger: Logger

  public constructor(logger: Logger) {
    this.logger = logger
  }
}
