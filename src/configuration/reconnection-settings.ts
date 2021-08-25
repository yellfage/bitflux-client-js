import { ReconnectionPolicy } from './reconnection-policy'
import { DefaultReconnectionPolicy } from './default-reconnection-policy'

export class ReconnectionSettings {
  public policy: ReconnectionPolicy

  public constructor(
    policy: ReconnectionPolicy = new DefaultReconnectionPolicy()
  ) {
    this.policy = policy
  }
}
