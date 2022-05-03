import type { NotifiableInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InvocationEventChannel,
  InvocationEventFactory,
  InvocationResultEventChannel,
} from '../../event'

import { BasicNotifiableInvocation } from './basic-notifiable-invocation'

export class BasicNotifiableInvocationBuilder
  implements NotifiableInvocationBuilder
{
  private readonly handlerName: string

  private args: unknown[] = []

  private readonly invocationEventChannel: InvocationEventChannel

  private readonly invocationResultEventChannel: InvocationResultEventChannel

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly bridge: Bridge

  public constructor(
    handlerName: string,
    invocationEventChannel: InvocationEventChannel,
    invocationResultEventChannel: InvocationResultEventChannel,
    invocationEventFactory: InvocationEventFactory,
    bridge: Bridge,
  ) {
    this.handlerName = handlerName
    this.invocationEventChannel = invocationEventChannel
    this.invocationResultEventChannel = invocationResultEventChannel
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
      this.invocationEventChannel,
      this.invocationResultEventChannel,
      this.invocationEventFactory,
      this.bridge,
    ).perform()
  }
}
