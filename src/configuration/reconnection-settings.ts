import { DefaultReconnectionPolicy } from './default-reconnection-policy'

import type { ReconnectionPolicy } from './reconnection-policy'

export class ReconnectionSettings {
  public policy: ReconnectionPolicy

  public constructor(
    policy: ReconnectionPolicy = new DefaultReconnectionPolicy()
  ) {
    this.policy = policy
  }
}
