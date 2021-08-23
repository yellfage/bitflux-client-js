import { DisconnectionCode } from '../communication'
import { ReconnectionPolicy } from './reconnection-policy'
import { ReconnectionConfirmationCallback } from './reconnection-confirmation-callback'
import { DefaultReconnectionPolicyOptions } from './default-reconnection-policy-options'

const RECONNECTABLE_CODES: DisconnectionCode[] = [
  DisconnectionCode.AbnormalClosure,
  DisconnectionCode.MissingExtension,
  DisconnectionCode.InternalServerError,
  DisconnectionCode.ServiceRestart,
  DisconnectionCode.TryAgainLater,
  DisconnectionCode.BadGateway,
  DisconnectionCode.TlsHandshake
]

const DEFAULT_DELAY_INDEX = -1
const DEFAULT_ATTEMPTS_AFTER_DELAYS = 0

export class DefaultReconnectionPolicy implements ReconnectionPolicy {
  private readonly delays: number[]
  private readonly minDelayOffset: number
  private readonly maxDelayOffset: number
  private readonly maxAttemptsAfterDelays: number
  private readonly confirmationCallback: ReconnectionConfirmationCallback

  private delayIndex: number
  private attemptsAfterDelays: number

  public constructor(options: DefaultReconnectionPolicyOptions = {}) {
    DefaultReconnectionPolicyOptions.validate(options)

    const {
      delays = [1000, 2000, 5000, 10000, 15000],
      minDelayOffset = 0,
      maxDelayOffset = 0,
      maxAttemptsAfterDelays = 0,
      confirm = (code) => RECONNECTABLE_CODES.includes(code)
    } = options

    this.delays = delays
    this.minDelayOffset = minDelayOffset
    this.maxDelayOffset = maxDelayOffset
    this.maxAttemptsAfterDelays = maxAttemptsAfterDelays
    this.confirmationCallback = confirm

    this.delayIndex = DEFAULT_DELAY_INDEX
    this.attemptsAfterDelays = DEFAULT_ATTEMPTS_AFTER_DELAYS
  }

  public confirm(code: DisconnectionCode, reason: string): boolean {
    return this.confirmationCallback(code, reason)
  }

  public getNextDelay(): number {
    if (
      this.arePrimaryAttemptsExhausted() &&
      this.areSecondaryAttemptsExhausted()
    ) {
      return -1
    }

    if (this.arePrimaryAttemptsExhausted()) {
      ++this.attemptsAfterDelays
    } else {
      ++this.delayIndex
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

  private areSecondaryAttemptsExhausted() {
    return this.attemptsAfterDelays === this.maxAttemptsAfterDelays
  }

  private generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
