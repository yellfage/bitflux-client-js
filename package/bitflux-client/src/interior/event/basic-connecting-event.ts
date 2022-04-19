import type { ConnectingEvent } from '../../event'

import { BasicEvent } from './basic-event'

export class BasicConnectingEvent
  extends BasicEvent
  implements ConnectingEvent {}
