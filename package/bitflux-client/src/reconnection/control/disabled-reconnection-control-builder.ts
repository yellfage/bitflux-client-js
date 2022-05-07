import { DisabledReconnectionControl } from './disabled-reconnection-control'

import type { ReconnectionControl } from './reconnection-control'

import type { ReconnectionControlBuilder } from './reconnection-control-builder'

export class DisabledReconnectionControlBuilder
  implements ReconnectionControlBuilder
{
  public build(): ReconnectionControl {
    return new DisabledReconnectionControl()
  }

  public clone(): ReconnectionControlBuilder {
    return new DisabledReconnectionControlBuilder()
  }
}
