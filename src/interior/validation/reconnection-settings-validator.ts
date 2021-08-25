import { ReconnectionSettings } from '../../configuration'

export class ReconnectionSettingsValidator {
  public static validate({ policy }: ReconnectionSettings): void {
    if (policy == null) {
      throw TypeError(
        'Invalid reconnection settings: the "policy" field cannot be a null or undefined'
      )
    }
  }
}
