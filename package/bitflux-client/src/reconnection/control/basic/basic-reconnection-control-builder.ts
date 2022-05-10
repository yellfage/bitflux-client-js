import type { ReconnectionControl } from '../reconnection-control'

import type { ReconnectionControlBuilder } from '../reconnection-control-builder'

import { BasicReconnectionControl } from './basic-reconnection-control'

export class BasicReconnectionControlBuilder
  implements ReconnectionControlBuilder
{
  private maxAttempts: number

  public constructor(maxAttempts = -1) {
    this.maxAttempts = maxAttempts
  }

  public setMaxAttempts(maxAttempts: number): this {
    this.maxAttempts = maxAttempts

    return this
  }

  public build(): ReconnectionControl {
    return new BasicReconnectionControl(this.maxAttempts)
  }
}
