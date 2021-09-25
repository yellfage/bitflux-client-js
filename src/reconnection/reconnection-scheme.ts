import type { DisconnectionCode } from '../communication'

export interface ReconnectionScheme {
  confirm(): boolean
  confirmCode(code: DisconnectionCode): boolean
  getNextDelay(attempts: number): number
  reset(): void
}
