import { CommunicationSettings } from '../communication-settings'

import { IProtocol } from '../../communication'

export class DefaultCommunicationSettings implements CommunicationSettings {
  public protocols: IProtocol[]

  public constructor() {
    this.protocols = []
  }
}
