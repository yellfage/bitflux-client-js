/* eslint-disable no-console */
import { LogLevel } from './log-level'

import type { Logger } from './logger'

export class DefaultLogger implements Logger {
  private readonly logLevel: LogLevel

  public constructor(logLevel: LogLevel) {
    this.logLevel = logLevel
  }

  public logTrace(message: unknown): void {
    this.log(LogLevel.Trace, message)
  }

  public logDebug(message: unknown): void {
    this.log(LogLevel.Debug, message)
  }

  public logInformation(message: unknown): void {
    this.log(LogLevel.Information, message)
  }

  public logWarning(message: unknown): void {
    this.log(LogLevel.Warning, message)
  }

  public logError(message: unknown): void {
    this.log(LogLevel.Error, message)
  }

  private log(logLevel: LogLevel, message: unknown): void {
    if (!this.isEnabled(logLevel)) {
      return
    }

    switch (logLevel) {
      case LogLevel.Trace:
        console.trace(message)
        break

      case LogLevel.Debug:
        console.debug(message)
        break

      case LogLevel.Information:
        console.info(message)
        break

      case LogLevel.Warning:
        console.warn(message)
        break

      case LogLevel.Error:
        console.error(message)
        break

      default:
        console.info(message)
        break
    }
  }

  private isEnabled(logLevel: LogLevel): boolean {
    return this.logLevel <= logLevel
  }
}
