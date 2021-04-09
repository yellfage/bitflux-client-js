const DEFAULT_ATTEMPT_DELAY_INDEX = -1
const DEFAULT_ATTEMPTS_AFTER_DELAY = 0

export class ReconnectionContext {
  public attemptDelayIndex: number
  public attemptsAfterDelays: number
  public abortController: AbortController | null

  public constructor() {
    this.attemptDelayIndex = DEFAULT_ATTEMPT_DELAY_INDEX
    this.attemptsAfterDelays = DEFAULT_ATTEMPTS_AFTER_DELAY
    this.abortController = null
  }

  public reset(): void {
    this.attemptDelayIndex = DEFAULT_ATTEMPT_DELAY_INDEX
    this.attemptsAfterDelays = DEFAULT_ATTEMPTS_AFTER_DELAY
  }

  public increaseAttemptDelayIndex(): number {
    return ++this.attemptDelayIndex
  }

  public increaseAttemptsAfterDelays(): number {
    return ++this.attemptsAfterDelays
  }

  public isReconnectionPerforming(): boolean {
    return this.attemptDelayIndex > DEFAULT_ATTEMPT_DELAY_INDEX
  }
}
