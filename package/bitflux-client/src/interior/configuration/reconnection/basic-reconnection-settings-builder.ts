import type {
  ReconnectionSettings,
  ReconnectionSettingsBuilder,
} from '../../../configuration'

import type {
  ReconnectionControlBuilder,
  ReconnectionDelaySchemeBuilder,
} from '../../../reconnection'

import {
  BasicReconnectionControlBuilder,
  BasicReconnectionDelaySchemeBuilder,
} from '../../../reconnection'

import { BasicReconnectionSettings } from './basic-reconnection-settings'

export class BasicReconnectionSettingsBuilder
  implements ReconnectionSettingsBuilder
{
  private controlBuilder: ReconnectionControlBuilder

  private delaySchemeBuilder: ReconnectionDelaySchemeBuilder

  public constructor()
  public constructor(
    controlBuilder: ReconnectionControlBuilder,
    delaySchemeBuilder: ReconnectionDelaySchemeBuilder,
  )
  public constructor(
    controlBuilder: ReconnectionControlBuilder = new BasicReconnectionControlBuilder(),
    delaySchemeBuilder: ReconnectionDelaySchemeBuilder = new BasicReconnectionDelaySchemeBuilder(),
  ) {
    this.controlBuilder = controlBuilder
    this.delaySchemeBuilder = delaySchemeBuilder
  }

  public setControl(builder: ReconnectionControlBuilder): this {
    this.controlBuilder = builder

    return this
  }

  public setDelayScheme(builder: ReconnectionDelaySchemeBuilder): this {
    this.delaySchemeBuilder = builder

    return this
  }

  public build(): ReconnectionSettings {
    return new BasicReconnectionSettings(
      this.controlBuilder.build(),
      this.delaySchemeBuilder.build(),
    )
  }

  public clone(): ReconnectionSettingsBuilder {
    return new BasicReconnectionSettingsBuilder(
      this.controlBuilder,
      this.delaySchemeBuilder,
    )
  }
}
