import { DisconnectionCode } from '../communication'

export type ReconnectionConfirmationCallback = (
  code: DisconnectionCode,
  reason: string
) => boolean
