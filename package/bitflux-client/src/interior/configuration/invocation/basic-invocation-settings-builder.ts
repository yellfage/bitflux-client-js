import type {
  InvocationSettings,
  InvocationSettingsBuilder,
} from '../../../configuration'

import type {
  RetryControlBuilder,
  RetryDelaySchemeBuilder,
} from '../../../invocation'

import {
  BasicRetryControlBuilder,
  BasicRetryDelaySchemeBuilder,
} from '../../../invocation'

import { BasicInvocationSettings } from './basic-invocation-settings'

export class BasicInvocationSettingsBuilder
  implements InvocationSettingsBuilder
{
  private rejectionDelay: number

  private attemptRejectionDelay: number

  private retryControlBuilder: RetryControlBuilder

  private retryDelaySchemeBuilder: RetryDelaySchemeBuilder

  public constructor()
  public constructor(
    rejectionDelay: number,
    attemptRejectionDelay: number,
    retryControlBuilder: RetryControlBuilder,
    retryDelaySchemeBuilder: RetryDelaySchemeBuilder,
  )
  public constructor(
    rejectionDelay = 30000,
    attemptRejectionDelay = 8000,
    retryControlBuilder: RetryControlBuilder = new BasicRetryControlBuilder(),
    retryDelaySchemeBuilder: RetryDelaySchemeBuilder = new BasicRetryDelaySchemeBuilder(),
  ) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
    this.retryControlBuilder = retryControlBuilder
    this.retryDelaySchemeBuilder = retryDelaySchemeBuilder
  }

  public setRejectionDelay(delay: number): this {
    this.rejectionDelay = delay

    return this
  }

  public setAttemptRejectionDelay(delay: number): this {
    this.attemptRejectionDelay = delay

    return this
  }

  public setRetryControl(builder: RetryControlBuilder): this {
    this.retryControlBuilder = builder

    return this
  }

  public setRetryDelayScheme(builder: RetryDelaySchemeBuilder): this {
    this.retryDelaySchemeBuilder = builder

    return this
  }

  public build(): InvocationSettings {
    return new BasicInvocationSettings(
      this.rejectionDelay,
      this.attemptRejectionDelay,
      this.retryControlBuilder.build(),
      this.retryDelaySchemeBuilder.build(),
    )
  }

  public clone(): InvocationSettingsBuilder {
    return new BasicInvocationSettingsBuilder(
      this.rejectionDelay,
      this.attemptRejectionDelay,
      this.retryControlBuilder,
      this.retryDelaySchemeBuilder,
    )
  }
}
