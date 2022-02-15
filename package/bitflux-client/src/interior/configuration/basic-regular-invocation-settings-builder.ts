import type {
  RegularInvocationSettings,
  RegularInvocationSettingsBuilder,
} from '../../configuration'

import { BasicRegularInvocationSettings } from './basic-regular-invocation-settings'

export class BasicRegularInvocationSettingsBuilder
  implements RegularInvocationSettingsBuilder
{
  private rejectionDelay = 30000

  private attemptRejectionDelay = 8000

  public constructor()
  public constructor(rejectionDelay: number, attemptRejectionDelay: number)
  public constructor(rejectionDelay = 30000, attemptRejectionDelay = 8000) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
  }

  public setRejectionDelay(delay: number): this {
    this.rejectionDelay = delay

    return this
  }

  public setAttemptRejectionDelay(delay: number): this {
    this.attemptRejectionDelay = delay

    return this
  }

  public build(): RegularInvocationSettings {
    return new BasicRegularInvocationSettings(
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )
  }

  public clone(): RegularInvocationSettingsBuilder {
    return new BasicRegularInvocationSettingsBuilder(
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )
  }
}
