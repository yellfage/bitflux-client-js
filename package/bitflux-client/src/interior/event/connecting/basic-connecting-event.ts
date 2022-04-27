import type { ConnectingEvent } from '../../../event'

import { BasicClientEvent } from '../basic-client-event'

export class BasicConnectingEvent
  extends BasicClientEvent
  implements ConnectingEvent {}
