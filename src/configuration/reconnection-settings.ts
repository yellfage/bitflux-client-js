import type { ReconnectionPolicy } from '../reconnection'

import { DefaultReconnectionPolicy } from '../reconnection'

export class ReconnectionSettings {
  public policy: ReconnectionPolicy

  public constructor(
    policy: ReconnectionPolicy = new DefaultReconnectionPolicy()
  ) {
    this.policy = policy
  }
}
