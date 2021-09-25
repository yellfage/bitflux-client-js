import type { ReconnectionScheme } from '../reconnection'

import { DefaultReconnectionScheme } from '../reconnection'

export class ReconnectionSettings {
  public scheme: ReconnectionScheme

  public constructor(
    scheme: ReconnectionScheme = new DefaultReconnectionScheme()
  ) {
    this.scheme = scheme
  }
}
