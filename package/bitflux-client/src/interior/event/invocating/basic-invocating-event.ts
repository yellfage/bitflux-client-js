import type { InvocatingEvent } from '../../../event'

import { BasicInvocationEvent } from '../basic-invocation-event'

export class BasicInvocatingEvent
  extends BasicInvocationEvent
  implements InvocatingEvent {}
