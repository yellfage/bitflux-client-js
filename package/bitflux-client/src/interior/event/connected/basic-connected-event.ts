import type { ConnectedEvent } from '../../../event'

import { BasicClientEvent } from '../basic-client-event'

export class BasicConnectedEvent
  extends BasicClientEvent
  implements ConnectedEvent {}
