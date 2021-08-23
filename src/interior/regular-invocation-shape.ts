import { InvocationShape } from './invocation-shape'

export class RegularInvocationShape<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationShape<THandlerName, TArgs> {
  public id: string
  public rejectionDelay: number
  public attemptRejectionDelay: number
  public abortController: AbortController

  public constructor(
    handlerName: THandlerName,
    args: TArgs,
    id: string,
    rejectionDelay: number,
    attemptRejectionDelay: number,
    abortController: AbortController
  ) {
    super(handlerName, args)

    this.id = id
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
    this.abortController = abortController
  }
}
