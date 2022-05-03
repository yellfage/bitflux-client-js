import type { NotifiableInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InvocationEventChannel,
  InvocationEventFactory,
  InvocationResultEventChannel,
} from '../../event'

import { BasicNotifiableInvocationBuilder } from './basic-notifiable-invocation-builder'

import type { NotifiableInvocationBuilderFactory } from './notifiable-invocation-builder-factory'

export class BasicNotifiableInvocationBuilderFactory
  implements NotifiableInvocationBuilderFactory
{
  private readonly invocationEventChannel: InvocationEventChannel

  private readonly invocationResultEventChannel: InvocationResultEventChannel

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly bridge: Bridge

  public constructor(
    invocationEventChannel: InvocationEventChannel,
    invocationResultEventChannel: InvocationResultEventChannel,
    invocationEventFactory: InvocationEventFactory,
    bridge: Bridge,
  ) {
    this.invocationEventChannel = invocationEventChannel
    this.invocationResultEventChannel = invocationResultEventChannel
    this.invocationEventFactory = invocationEventFactory
    this.bridge = bridge
  }

  public create(handlerName: string): NotifiableInvocationBuilder {
    return new BasicNotifiableInvocationBuilder(
      handlerName,
      this.invocationEventChannel,
      this.invocationResultEventChannel,
      this.invocationEventFactory,
      this.bridge,
    )
  }
}
