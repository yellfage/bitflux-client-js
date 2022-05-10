import type {
  Transport,
  TransportClosingEventHandler,
  TransportMessagingEventHandler,
  TransportOpeningEventHandler,
} from '../../communication'

const ERROR_MESSAGE = 'Unable to acceess to the empty transport'

export class EmptyTransport implements Transport {
  public get name(): string {
    throw new Error(ERROR_MESSAGE)
  }

  public onopening: TransportOpeningEventHandler | null = null

  public onclosing: TransportClosingEventHandler | null = null

  public onmessaging: TransportMessagingEventHandler | null = null

  public survey(): boolean {
    throw new Error(ERROR_MESSAGE)
  }

  public open(): void {
    throw new Error(ERROR_MESSAGE)
  }

  public close(): void {
    throw new Error(ERROR_MESSAGE)
  }

  public send(): void {
    throw new Error(ERROR_MESSAGE)
  }
}
