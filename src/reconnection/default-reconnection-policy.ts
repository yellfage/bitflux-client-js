import type { DisconnectionCode } from '../communication'

import { validateDefaultReconnectionPolicyOptions } from '../interior/validation'

import type { DefaultReconnectionPolicyOptions } from './default-reconnection-policy-options'

import { RECONNECTABLE_DISCONNECTION_CODES } from './reconnectable-disconnection-codes'

import type { ReconnectionPolicy } from './reconnection-policy'

const DEFAULT_DELAY_INDEX = -1
const DEFAULT_ATTEMPTS_AFTER_DELAYS = 0

export class DefaultReconnectionPolicy implements ReconnectionPolicy {
  private readonly delays: number[]

  private readonly minDelayOffset: number

  private readonly maxDelayOffset: number

  private readonly maxAttemptsAfterDelays: number

  private readonly reconnectableCodes: DisconnectionCode[]

  private delayIndex: number

  private attemptsAfterDelays: number

  public constructor(options: DefaultReconnectionPolicyOptions = {}) {
    validateDefaultReconnectionPolicyOptions(options)

    const {
      delays = [1000, 2000, 5000, 10000, 15000],
      minDelayOffset = 0,
      maxDelayOffset = 0,
      maxAttemptsAfterDelays = 0,
      reconnectableCodes = RECONNECTABLE_DISCONNECTION_CODES
    } = options

    this.delays = delays
    this.minDelayOffset = minDelayOffset
    this.maxDelayOffset = maxDelayOffset
    this.maxAttemptsAfterDelays = maxAttemptsAfterDelays
    this.reconnectableCodes = reconnectableCodes

    this.delayIndex = DEFAULT_DELAY_INDEX
    this.attemptsAfterDelays = DEFAULT_ATTEMPTS_AFTER_DELAYS
  }

  public confirm(): boolean {
    return (
      !this.arePrimaryAttemptsExhausted() ||
      !this.areSecondaryAttemptsExhausted()
    )
  }

  public confirmCode(code: DisconnectionCode): boolean {
    return this.confirm() && this.reconnectableCodes.includes(code)
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
