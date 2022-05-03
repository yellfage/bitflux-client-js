import type { Bridge } from '../../communication'

import { OutgoingNotifiableInvocationMessage } from '../../communication'

import type {
  InvocationEventChannel,
  InvocationEventFactory,
  InvocationResultEventChannel,
} from '../../event'

import type { NotifiableInvocation } from './notifiable-invocation'

import type { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class BasicNotifiableInvocation implements NotifiableInvocation {
  public readonly shape: NotifiableInvocationShape

  public readonly invocation: InvocationEventChannel

  public readonly invocationResult: InvocationResultEventChannel

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly bridge: Bridge

  public constructor(
    shape: NotifiableInvocationShape,
    invocationEventChannel: InvocationEventChannel,
    invocationResultEventChannel: InvocationResultEventChannel,
    invocationEventFactory: InvocationEventFactory,
    bridge: Bridge,
  ) {
    this.shape = shape
    this.invocation = invocationEventChannel
    this.invocationResult = invocationResultEventChannel
    this.invocationEventFactory = invocationEventFactory
    this.bridge = bridge
  }

  public async perform(): Promise<void> {
    const invocationEvent = this.invocationEventFactory.create(this)

    await this.invocation.emit(invocationEvent)

    this.bridge.send(
      new OutgoingNotifiableInvocationMessage(
        this.shape.handlerName,
        this.shape.args,
      ),
    )
  }
}
