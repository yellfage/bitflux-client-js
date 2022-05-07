import type {
  InvocationSettings,
  InvocationSettingsBuilder,
} from '../../../configuration'

import { BasicInvocationSettings } from './basic-invocation-settings'

export class BasicInvocationSettingsBuilder
  implements InvocationSettingsBuilder
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

  public build(): InvocationSettings {
    return new BasicInvocationSettings(
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )
  }

  public clone(): InvocationSettingsBuilder {
    return new BasicInvocationSettingsBuilder(
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )
  }
}
