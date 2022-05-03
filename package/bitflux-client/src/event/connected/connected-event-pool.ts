import type { EventPool } from '@yellfage/events'

import type { ConnectedEventHandler } from './connected-event-handler'

export interface ConnectedEventPool extends EventPool<ConnectedEventHandler> {}
