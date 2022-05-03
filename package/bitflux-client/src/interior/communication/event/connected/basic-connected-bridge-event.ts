import { BasicBridgeEvent } from '../basic-bridge-event'

import type { ConnectedBridgeEvent } from './connected-bridge-event'

export class BasicConnectedBridgeEvent
  extends BasicBridgeEvent
  implements ConnectedBridgeEvent {}
