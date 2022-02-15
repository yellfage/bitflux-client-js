import { BasicReconnectionControl } from './basic-reconnection-control'

import type { ReconnectionControl } from './reconnection-control'

import type { ReconnectionControlBuilder } from './reconnection-control-builder'

export class BasicReconnectionControlBuilder
  implements ReconnectionControlBuilder
{
  private maxAttempts = -1

  public setMaxAttempts(maxAttempts: number): this {
    this.maxAttempts = maxAttempts

    return this
  }

  public build(): ReconnectionControl {
    return new BasicReconnectionControl(this.maxAttempts)
  }
}
