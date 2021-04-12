import { WebSocketCloseStatus } from '../../web-socket-close-status'

import { Callback } from '../../internal/callback'
import { ReconnectionSettings } from '../reconnection-settings'
import { ReconnectionConfirmationContext } from '../reconnection-confirmation-context'

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
    this.confirm = this.confirmDefault
  }

  private confirmDefault(context: ReconnectionConfirmationContext) {
    return (
      context.closeStatus !== WebSocketCloseStatus.NormalClosure &&
      context.closeStatus !== WebSocketCloseStatus.EndpointUnavailable &&
      context.closeStatus !== WebSocketCloseStatus.ProtocolError &&
      context.closeStatus !== WebSocketCloseStatus.InvalidMessageType &&
      context.closeStatus !== WebSocketCloseStatus.Empty &&
      context.closeStatus !== WebSocketCloseStatus.InvalidPayloadData &&
      context.closeStatus !== WebSocketCloseStatus.PolicyViolation &&
      context.closeStatus !== WebSocketCloseStatus.MessageTooBig
    )
  }
}
