export interface Logger {
  logTrace: (message: unknown) => void
  logDebug: (message: unknown) => void
  logInformation: (message: unknown) => void
  logWarning: (message: unknown) => void
  logError: (message: unknown) => void
}
