import type { NotifiableInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import { BasicNotifiableInvocationBuilder } from './basic-notifiable-invocation-builder'

import type { NotifiableInvocationBuilderFactory } from './notifiable-invocation-builder-factory'

export class BasicNotifiableInvocationBuilderFactory
  implements NotifiableInvocationBuilderFactory
{
  private readonly bridge: Bridge

  public constructor(bridge: Bridge) {
    this.bridge = bridge
  }

  public create(handlerName: string): NotifiableInvocationBuilder {
    return new BasicNotifiableInvocationBuilder(this.bridge, handlerName)
  }
}
