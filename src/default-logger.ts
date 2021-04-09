/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ILogger } from './i-logger'

import { LogLevel } from './log-level'

export class DefaultLogger implements ILogger {
  private readonly logLevel: LogLevel

  public constructor(logLevel: LogLevel) {
    this.logLevel = logLevel
  }

  public logTrace(message: any): any {
    this.log(LogLevel.Trace, message)
  }

  public logDebug(message: any): any {
    this.log(LogLevel.Debug, message)
  }

  public logInformation(message: any): any {
    this.log(LogLevel.Information, message)
  }

  public logWarning(message: any): any {
    this.log(LogLevel.Warning, message)
  }

  public logError(message: any): any {
    this.log(LogLevel.Error, message)
  }

  private log(logLevel: LogLevel, message: any) {
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
    }
  }

  private isEnabled(logLevel: LogLevel): boolean {
    return this.logLevel <= logLevel
  }
}
