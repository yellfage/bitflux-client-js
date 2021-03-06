import type { ReconnectionDelayScheme } from '../reconnection-delay-scheme'

import type { ReconnectionDelaySchemeBuilder } from '../reconnection-delay-scheme-builder'

import { BasicReconnectionDelayScheme } from './basic-reconnection-delay-scheme'

export class BasicReconnectionDelaySchemeBuilder
  implements ReconnectionDelaySchemeBuilder
{
  private delays: number[]

  private minDelayOffset: number

  private maxDelayOffset: number

  public constructor()
  public constructor(
    delays: number[],
    minDelayOffset: number,
    maxDelayOffset: number,
  )
  public constructor(
    delays = [1000, 2000, 5000],
    minDelayOffset = 0,
    maxDelayOffset = 0,
  ) {
    this.delays = delays
    this.minDelayOffset = minDelayOffset
    this.maxDelayOffset = maxDelayOffset
  }

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
