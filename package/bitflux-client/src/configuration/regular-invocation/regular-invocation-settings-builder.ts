import type { RegularInvocationSettings } from './regular-invocation-settings'

export interface RegularInvocationSettingsBuilder {
  setRejectionDelay(delay: number): this
  setAttemptRejectionDelay(delay: number): this
  build(): RegularInvocationSettings
  clone(): RegularInvocationSettingsBuilder
}
