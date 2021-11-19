import type { ReconnectionScheme } from './reconnection-scheme'

const DEFAULT_DELAY_INDEX = -1
const DEFAULT_ATTEMPTS_AFTER_DELAYS = 0

export class BasicReconnectionScheme implements ReconnectionScheme {
  private readonly delays: number[]

  private readonly minDelayOffset: number

  private readonly maxDelayOffset: number

  private readonly maxAttemptsAfterDelays: number

  private delayIndex: number

  private attemptsAfterDelays: number

  public constructor(
    delays: number[],
    minDelayOffset: number,
    maxDelayOffset: number,
    maxAttemptsAfterDelays: number
  ) {
    this.delays = delays
    this.minDelayOffset = minDelayOffset
    this.maxDelayOffset = maxDelayOffset
    this.maxAttemptsAfterDelays = maxAttemptsAfterDelays

    this.delayIndex = DEFAULT_DELAY_INDEX
    this.attemptsAfterDelays = DEFAULT_ATTEMPTS_AFTER_DELAYS
  }

  public confirm(): boolean {
    return (
      !this.arePrimaryAttemptsExhausted() ||
      !this.areSecondaryAttemptsExhausted()
    )
  }

  public getNextDelay(): number {
    if (this.arePrimaryAttemptsExhausted()) {
      this.attemptsAfterDelays += 1
    } else {
      this.delayIndex += 1
    }

    const delay = this.delays[this.delayIndex] || 0

    const delayAddition = this.generateRandomInt(
      this.minDelayOffset,
      this.maxDelayOffset
    )

    return delay + delayAddition
  }

  public reset(): void {
    this.delayIndex = DEFAULT_DELAY_INDEX
    this.attemptsAfterDelays = DEFAULT_ATTEMPTS_AFTER_DELAYS
  }

  private arePrimaryAttemptsExhausted(): boolean {
    return !this.delays.length || this.delayIndex === this.delays.length - 1
  }

  private areSecondaryAttemptsExhausted(): boolean {
    return this.attemptsAfterDelays === this.maxAttemptsAfterDelays
  }

  private generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
