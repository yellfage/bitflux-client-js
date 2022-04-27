import type { EventEmitter } from '@yellfage/event-emitter'

import type { InvocationEventHandlerMap } from '../../../event'

import type { NotifiableInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type { InvocationEventFactory } from '../../event'

import { BasicNotifiableInvocation } from './basic-notifiable-invocation'

export class BasicNotifiableInvocationBuilder
  implements NotifiableInvocationBuilder
{
  private readonly handlerName: string

  private args: unknown[] = []

  private readonly eventEmitter: EventEmitter<InvocationEventHandlerMap>

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly bridge: Bridge

  public constructor(
    handlerName: string,
    eventEmitter: EventEmitter<InvocationEventHandlerMap>,
    invocationEventFactory: InvocationEventFactory,
    bridge: Bridge,
  ) {
    this.handlerName = handlerName
    this.eventEmitter = eventEmitter
    this.invocationEventFactory = invocationEventFactory
    this.bridge = bridge
  }

  public setArgs(...args: unknown[]): this {
    this.args = args

    return this
  }

  public perform(): Promise<void> {
    return new BasicNotifiableInvocation(
      {
        handlerName: this.handlerName,
        args: this.args,
      },
      this.eventEmitter,
      this.invocationEventFactory,
      this.bridge,
    ).perform()
  }
}
