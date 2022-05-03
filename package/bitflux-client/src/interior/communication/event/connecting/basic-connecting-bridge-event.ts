import { BasicBridgeEvent } from '../basic-bridge-event'

import type { ConnectingBridgeEvent } from './connecting-bridge-event'

export class BasicConnectingBridgeEvent
  extends BasicBridgeEvent
  implements ConnectingBridgeEvent {}
