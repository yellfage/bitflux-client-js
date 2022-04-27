import type { EventEmitter } from '@yellfage/event-emitter'

import type { InvocationEventHandlerMap } from '../../../event'

import type { Bridge } from '../../communication'

import { OutgoingNotifiableInvocationMessage } from '../../communication'

import type { InvocationEventFactory } from '../../event'

import type { NotifiableInvocation } from './notifiable-invocation'

import type { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class BasicNotifiableInvocation implements NotifiableInvocation {
  public readonly shape: NotifiableInvocationShape

  private readonly eventEmitter: EventEmitter<InvocationEventHandlerMap>

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly bridge: Bridge

  public constructor(
    shape: NotifiableInvocationShape,
    eventEmitter: EventEmitter<InvocationEventHandlerMap>,
    invocationEventFactory: InvocationEventFactory,
    bridge: Bridge,
  ) {
    this.shape = shape
    this.eventEmitter = eventEmitter
    this.invocationEventFactory = invocationEventFactory
    this.bridge = bridge
  }

  public async perform(): Promise<void> {
    const invocationEvent = this.invocationEventFactory.create(this)

    await this.eventEmitter.emit('invocation', invocationEvent)

    this.bridge.send(
      new OutgoingNotifiableInvocationMessage(
        this.shape.handlerName,
        this.shape.args,
      ),
    )
  }
}
