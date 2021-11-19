import type { NotifiableInvocationBuilder } from '../../invocation'

import type { Bridge } from '../communication'

import { BasicNotifiableInvocation } from './basic-notifiable-invocation'

export class BasicNotifiableInvocationBuilder
  implements NotifiableInvocationBuilder
{
  private args: unknown[] = []

  private readonly bridge: Bridge

  private readonly handlerName: string

  public constructor(bridge: Bridge, handlerName: string) {
    this.bridge = bridge
    this.handlerName = handlerName
  }

  public setArgs(...args: unknown[]): this {
    this.args = args

    return this
  }

  public perform(): void {
    new BasicNotifiableInvocation(this.bridge, {
      handlerName: this.handlerName,
      args: this.args
    }).perform()
  }
}
