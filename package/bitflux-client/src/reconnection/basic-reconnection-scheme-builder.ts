import { BasicReconnectionScheme } from './basic-reconnection-scheme'

import type { ReconnectionScheme } from './reconnection-scheme'

import type { ReconnectionSchemeBuilder } from './reconnection-scheme-builder'

export class BasicReconnectionSchemeBuilder
  implements ReconnectionSchemeBuilder
{
  private delays = [1000, 2000, 3000]

  private minDelayOffset = 0

  private maxDelayOffset = 0

  private maxAttemptsAfterDelays = 0

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

  public setMaxAttemptsAfterDelays(attempts: number): this {
    this.maxAttemptsAfterDelays = attempts

    return this
  }

  public build(): ReconnectionScheme {
    return new BasicReconnectionScheme(
      this.delays,
      this.minDelayOffset,
      this.maxDelayOffset,
      this.maxAttemptsAfterDelays,
    )
  }
}
