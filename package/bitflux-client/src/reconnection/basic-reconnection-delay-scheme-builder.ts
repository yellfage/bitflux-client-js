import { BasicReconnectionDelayScheme } from './basic-reconnection-delay-scheme'

import type { ReconnectionDelayScheme } from './reconnection-delay-scheme'

import type { ReconnectionDelaySchemeBuilder } from './reconnection-delay-scheme-builder'

export class BasicReconnectionDelaySchemeBuilder
  implements ReconnectionDelaySchemeBuilder
{
  private delays = [1000, 2000, 3000]

  private minDelayOffset = 0

  private maxDelayOffset = 0

  public setDelays(delays: number[]): this {
    this.delays = delays

    return this
  }

  public setMinDelayOffset(offset: number): this {
    this.minDelayOffset = offset

    return this
  }

  public setMaxDelayOffset(offset: number): this {
    this.maxDelayOffset = offset

    return this
  }

  public build(): ReconnectionDelayScheme {
    return new BasicReconnectionDelayScheme(
      this.delays,
      this.minDelayOffset,
      this.maxDelayOffset,
    )
  }
}
