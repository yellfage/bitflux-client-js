export interface Logger {
  logTrace(message: any): any
  logDebug(message: any): any
  logInformation(message: any): any
  logWarning(message: any): any
  logError(message: any): any
}
