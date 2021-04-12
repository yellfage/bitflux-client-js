import { WebSocketCloseStatus } from '../../web-socket-close-status'

import { Callback } from '../../internal/callback'
import { ReconnectionSettings } from '../reconnection-settings'
import { ReconnectionConfirmationContext } from '../reconnection-confirmation-context'

const NON_RETRYABLE_CLOSE_STATUSES: WebSocketCloseStatus[] = [
  WebSocketCloseStatus.NormalClosure,
  WebSocketCloseStatus.EndpointUnavailable,
  WebSocketCloseStatus.ProtocolError,
  WebSocketCloseStatus.InvalidMessageType,
  WebSocketCloseStatus.Empty,
  WebSocketCloseStatus.InvalidPayloadData,
  WebSocketCloseStatus.PolicyViolation,
  WebSocketCloseStatus.MessageTooBig
]

export class DefaultReconnectionSettings implements ReconnectionSettings {
  public attemptsDelays: number[]
  public minAttemptDelayAddition: number
  public maxAttemptDelayAddition: number
  public maxAttemptsAfterDelays: number
  public confirm: Callback<[ReconnectionConfirmationContext], boolean>

  public constructor() {
    this.attemptsDelays = [1000, 2000, 5000, 10000, 15000]
    this.minAttemptDelayAddition = 0
    this.maxAttemptDelayAddition = 0
    this.maxAttemptsAfterDelays = -1
    this.confirm = (context) =>
      !NON_RETRYABLE_CLOSE_STATUSES.includes(context.closeStatus!)
  }
}
