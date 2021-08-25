import { LoggingSettings } from '../../configuration'

export class LoggingSettingsValidator {
  public static validate({ logger }: LoggingSettings): void {
    if (logger == null) {
      throw TypeError(
        'Invalid logging settings: the "logger" field cannot be a null or undefined'
      )
    }
  }
}
