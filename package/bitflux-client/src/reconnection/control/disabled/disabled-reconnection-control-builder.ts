import type { ReconnectionControl } from '../reconnection-control'

import type { ReconnectionControlBuilder } from '../reconnection-control-builder'

import { DisabledReconnectionControl } from './disabled-reconnection-control'

export class DisabledReconnectionControlBuilder
  implements ReconnectionControlBuilder
{
  public build(): ReconnectionControl {
    return new DisabledReconnectionControl()
  }
}
