import type { InvocationSettings } from './invocation-settings'

export interface InvocationSettingsBuilder {
  setRejectionDelay(delay: number): this
  setAttemptRejectionDelay(delay: number): this
  build(): InvocationSettings
  clone(): InvocationSettingsBuilder
}
