import type { Bridge } from '../communication'

import { OutgoingNotifiableInvocationMessage } from '../communication'

import type { NotifiableInvocation } from './notifiable-invocation'

import type { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class BasicNotifiableInvocation implements NotifiableInvocation {
  private readonly bridge: Bridge

  private readonly shape: NotifiableInvocationShape

  public constructor(bridge: Bridge, shape: NotifiableInvocationShape) {
    this.bridge = bridge
    this.shape = shape
  }

  public perform(): void {
    this.bridge.send(
      new OutgoingNotifiableInvocationMessage(
        this.shape.handlerName,
        this.shape.args,
      ),
    )
  }
}
