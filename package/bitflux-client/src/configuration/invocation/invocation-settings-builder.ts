import type {
  RetryControlBuilder,
  RetryDelaySchemeBuilder,
} from '../../invocation'

import type { InvocationSettings } from './invocation-settings'

export interface InvocationSettingsBuilder {
  setRejectionDelay(delay: number): this
  setAttemptRejectionDelay(delay: number): this
  setRetryControl(builder: RetryControlBuilder): this
  setRetryDelayScheme(builder: RetryDelaySchemeBuilder): this
  build(): InvocationSettings
  clone(): InvocationSettingsBuilder
}
