import { DisconnectionCode } from '../communication'

export const RECONNECTABLE_DISCONNECTION_CODES: DisconnectionCode[] = [
  DisconnectionCode.AbnormalClosure,
  DisconnectionCode.MissingExtension,
  DisconnectionCode.InternalServerError,
  DisconnectionCode.ServiceRestart,
  DisconnectionCode.TryAgainLater,
  DisconnectionCode.BadGateway,
  DisconnectionCode.TlsHandshake
]
