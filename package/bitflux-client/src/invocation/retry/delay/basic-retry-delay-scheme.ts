import type { RetryDelayScheme } from './retry-delay-scheme'

export class BasicRetryDelayScheme implements RetryDelayScheme {
  private readonly delays: number[]

  private readonly minDelayOffset: number

  private readonly maxDelayOffset: number

  private delayIndex = -1

  public constructor(
    delays: number[],
    minDelayOffset: number,
    maxDelayOffset: number,
  ) {
    this.delays = delays
    this.minDelayOffset = minDelayOffset
    this.maxDelayOffset = maxDelayOffset
  }

  public moveNext(): number {
    if (this.delayIndex < this.delays.length - 1) {
      this.delayIndex += 1
    }

    return (this.delays[this.delayIndex] ?? 0) + this.generateDelayOffset()
  }

  public clone(): RetryDelayScheme {
    return new BasicRetryDelayScheme(
      this.delays,
      this.minDelayOffset,
      this.maxDelayOffset,
    )
  }

  private generateDelayOffset(): number {
    return (
      Math.floor(
        Math.random() * (this.maxDelayOffset - this.minDelayOffset + 1),
      ) + this.minDelayOffset
    )
  }
}
