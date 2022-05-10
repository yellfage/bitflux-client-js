import type { RetryDelayScheme } from '../retry-delay-scheme'

import type { RetryDelaySchemeBuilder } from '../retry-delay-scheme-builder'

import { BasicRetryDelayScheme } from './basic-retry-delay-scheme'

export class BasicRetryDelaySchemeBuilder implements RetryDelaySchemeBuilder {
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

  public build(): RetryDelayScheme {
    return new BasicRetryDelayScheme(
      this.delays,
      this.minDelayOffset,
      this.maxDelayOffset,
    )
  }
}
