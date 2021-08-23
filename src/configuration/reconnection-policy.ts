import { DisconnectionCode } from '../communication'

export interface ReconnectionPolicy {
  confirm(code: DisconnectionCode, reason: string): boolean
  getNextDelay(): number
  reset(): void
}
