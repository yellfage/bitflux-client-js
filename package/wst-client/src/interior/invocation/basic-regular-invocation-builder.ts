import { nanoid } from 'nanoid'

import type { RegularInvocationBuilder } from '../../invocation'

import type { Bridge } from '../communication'

import { BasicRegularInvocation } from './basic-regular-invocation'

export class BasicRegularInvocationBuilder<TResult>
  implements RegularInvocationBuilder<TResult>
{
  private args: unknown[] = []

  private abortController = new AbortController()

  private rejectionDelay: number

  private attemptRejectionDelay: number

  private readonly bridge: Bridge

  private readonly handlerName: string

  public constructor(
    bridge: Bridge,
    handlerName: string,
    defaultRejectionDelay: number,
    defaultAttempRejectionDelay: number
  ) {
    this.bridge = bridge
    this.handlerName = handlerName
    this.rejectionDelay = defaultRejectionDelay
    this.attemptRejectionDelay = defaultAttempRejectionDelay
  }

  public setArgs(...args: unknown[]): this {
    this.args = args

    return this
  }

  public setRejectionDelay(delay: number): this {
    this.rejectionDelay = delay

    return this
  }

  public setAttemptRejectionDelay(delay: number): this {
    this.attemptRejectionDelay = delay

    return this
  }

  public setAbortController(controller: AbortController): this {
    this.abortController = controller

    return this
  }

  public perform(): Promise<TResult> {
    return new BasicRegularInvocation<TResult>(this.bridge, {
      handlerName: this.handlerName,
      args: this.args,
      id: nanoid(),
      rejectionDelay: this.rejectionDelay,
      attemptRejectionDelay: this.attemptRejectionDelay,
      abortController: this.abortController
    }).perform()
  }
}
