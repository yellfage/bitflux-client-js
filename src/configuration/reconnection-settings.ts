import { ReconnectionPolicy } from './reconnection-policy'
import { DefaultReconnectionPolicy } from './default-reconnection-policy'

export class ReconnectionSettings {
  public policy: ReconnectionPolicy

  public constructor(
    policy: ReconnectionPolicy = new DefaultReconnectionPolicy()
  ) {
    this.policy = policy
  }

  public static validate(settings: ReconnectionSettings): void {
    if (settings.policy == null) {
      throw TypeError(
        'Invalid reconnection settings: the "policy" field cannot be a null or undefined'
      )
    }
  }
}
