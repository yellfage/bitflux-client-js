import type { LoggingSettings } from '../../configuration'

export function validateLoggingSettings({ logger }: LoggingSettings): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (logger == null) {
    throw new TypeError(
      'Invalid logging settings: the "logger" field cannot be a null or undefined'
    )
  }
}
