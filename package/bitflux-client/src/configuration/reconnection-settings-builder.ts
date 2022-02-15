import {
  BasicReconnectionControlBuilder,
  BasicReconnectionDelaySchemeBuilder,
} from '../reconnection'

import type {
  ReconnectionDelaySchemeBuilder,
  ReconnectionControlBuilder,
} from '../reconnection'

import { ReconnectionSettings } from './reconnection-settings'

export class ReconnectionSettingsBuilder {
  private controlBuilder: ReconnectionControlBuilder =
    new BasicReconnectionControlBuilder()

  private delaySchemeBuilder: ReconnectionDelaySchemeBuilder =
    new BasicReconnectionDelaySchemeBuilder()

  public setControlBuilder(builder: ReconnectionControlBuilder): this {
    this.controlBuilder = builder

    return this
  }

  public setDelaySchemeBuilder(builder: ReconnectionDelaySchemeBuilder): this {
    this.delaySchemeBuilder = builder

    return this
  }

  public build(): ReconnectionSettings {
    return new ReconnectionSettings(
      this.controlBuilder.build(),
      this.delaySchemeBuilder.build(),
    )
  }
}
