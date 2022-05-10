import { LogLevel } from '../log-level'

import type { Logger } from '../logger'

import type { LoggerBuilder } from '../logger-builder'

import { BasicLogger } from './basic-logger'

export class BasicLoggerBuilder implements LoggerBuilder {
  private level: LogLevel

  public constructor(level = LogLevel.Trace) {
    this.level = level
  }

  public setLevel(level: LogLevel): this {
    this.level = level

    return this
  }

  public build(): Logger {
    return new BasicLogger(this.level)
  }
}
