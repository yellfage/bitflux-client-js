import { CommunicationSettings } from '../../configuration'

export class CommunicationSettingsValidator {
  public static validate({ protocols }: CommunicationSettings): void {
    if (!Array.isArray(protocols)) {
      throw new TypeError(
        'Invalid communication settings: the "protocols" field must be an array'
      )
    }
  }
}
