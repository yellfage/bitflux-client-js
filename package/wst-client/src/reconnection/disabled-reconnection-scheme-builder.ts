import { DisabledReconnectionScheme } from './disabled-reconnection-scheme'

import type { ReconnectionScheme } from './reconnection-scheme'

import type { ReconnectionSchemeBuilder } from './reconnection-scheme-builder'

export class DisabledReconnectionSchemeBuilder
  implements ReconnectionSchemeBuilder
{
  public build(): ReconnectionScheme {
    return new DisabledReconnectionScheme()
  }
}
