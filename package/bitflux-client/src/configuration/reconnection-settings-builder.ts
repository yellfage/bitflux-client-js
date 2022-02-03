import { BasicReconnectionSchemeBuilder } from '../reconnection'

import type { ReconnectionSchemeBuilder } from '../reconnection'

import { ReconnectionSettings } from './reconnection-settings'

export class ReconnectionSettingsBuilder {
  private schemeBuilder: ReconnectionSchemeBuilder =
    new BasicReconnectionSchemeBuilder()

  public setSchemeBuilder(builder: ReconnectionSchemeBuilder): this {
    this.schemeBuilder = builder

    return this
  }

  public build(): ReconnectionSettings {
    return new ReconnectionSettings(this.schemeBuilder.build())
  }
}
