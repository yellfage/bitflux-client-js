import type { EventEmitter } from '@yellfage/event-emitter'

import type { InvocationEventHandlerMap } from '../../../event'

import type { NotifiableInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type { InvocationEventFactory } from '../../event'

import { BasicNotifiableInvocationBuilder } from './basic-notifiable-invocation-builder'

import type { NotifiableInvocationBuilderFactory } from './notifiable-invocation-builder-factory'

export class BasicNotifiableInvocationBuilderFactory
  implements NotifiableInvocationBuilderFactory
{
  private readonly eventEmitter: EventEmitter<InvocationEventHandlerMap>

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly bridge: Bridge

  public constructor(
    eventEmitter: EventEmitter<InvocationEventHandlerMap>,
    invocationEventFactory: InvocationEventFactory,
    bridge: Bridge,
  ) {
    this.eventEmitter = eventEmitter
    this.invocationEventFactory = invocationEventFactory
    this.bridge = bridge
  }

  public create(handlerName: string): NotifiableInvocationBuilder {
    return new BasicNotifiableInvocationBuilder(
      handlerName,
      this.eventEmitter,
      this.invocationEventFactory,
      this.bridge,
    )
  }
}
