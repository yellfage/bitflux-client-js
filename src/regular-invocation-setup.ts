import { InvocationSetup } from './invocation-setup'

import { NumberUtils } from './interior/number-utils'

export class RegularInvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationSetup<THandlerName, TArgs> {
  public rejectionDelay?: number
  public attemptRejectionDelay?: number
  public abortController?: AbortController

  public constructor(
    handlerName: THandlerName,
    args?: TArgs,
    rejectionDelay?: number,
    attemptRejectionDelay?: number,
    abortController?: AbortController
  ) {
    super(handlerName, args)

    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
    this.abortController = abortController
  }

  public static validate(setup: RegularInvocationSetup): void {
    InvocationSetup.validate(setup)

    if (
      setup.rejectionDelay !== undefined &&
      (!NumberUtils.isNumber(setup.rejectionDelay) ||
        Number.isNaN(setup.rejectionDelay))
    ) {
      throw new TypeError(
        'Invalid regular invocation setup: the "rejectionDelay" field must be a number'
      )
    }

    if (
      setup.attemptRejectionDelay !== undefined &&
      (!NumberUtils.isNumber(setup.attemptRejectionDelay) ||
        Number.isNaN(setup.attemptRejectionDelay))
    ) {
      throw new TypeError(
        'Invalid regular invocation setup: the "attemptRejectionDelay" field must be a number'
      )
    }
  }
}
