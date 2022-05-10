import { LogLevel } from '../log-level'

import type { Logger } from '../logger'

import type { LoggerBuilder } from '../logger-builder'

import { ConsoleLogger } from './console-logger'

export class ConsoleLoggerBuilder implements LoggerBuilder {
  private level: LogLevel

  public constructor(level = LogLevel.Trace) {
    this.level = level
  }

  public setLevel(level: LogLevel): this {
    this.level = level

    return this
  }

  public build(): Logger {
    return new ConsoleLogger(this.level)
  }
}