import { Protocol } from '../communication'

export class CommunicationSettings {
  public protocols: Protocol[]

  public constructor(protocols: Protocol[] = []) {
    this.protocols = protocols
  }

  public static validate(settings: CommunicationSettings): void {
    if (!Array.isArray(settings.protocols)) {
      throw new TypeError(
        'Invalid communication settings: the "protocols" field must be an array'
      )
    }
  }
}
