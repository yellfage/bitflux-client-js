import { DisconnectionCode } from '../communication'

export interface ReconnectionPolicy {
  confirm(code: DisconnectionCode): boolean
  getNextDelay(): number
  reset(): void
}
