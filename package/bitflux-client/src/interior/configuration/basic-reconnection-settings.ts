import type { ReconnectionSettings } from '../../configuration'

import type {
  ReconnectionControl,
  ReconnectionDelayScheme,
} from '../../reconnection'

export class BasicReconnectionSettings implements ReconnectionSettings {
  public readonly control: ReconnectionControl

  public readonly delayScheme: ReconnectionDelayScheme

  public constructor(
    control: ReconnectionControl,
    delayScheme: ReconnectionDelayScheme,
  ) {
    this.control = control
    this.delayScheme = delayScheme
  }
}
