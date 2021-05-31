import { IClient } from './i-client'
import { ClientOptions } from './client-options'
import {
  CommunicationSettings,
  ReconnectionSettings,
  InvocationSettings
} from './settings'

import { StringHelper } from './internal/string-helper'
import { ObjectHelper } from './internal/object-helper'

import { JsonProtocol } from './communication'
import { Client } from './internal/client'
import { WebSocketClientFactory } from './internal/web-socket-client-factory'
import { DefaultLoggingSettings } from './settings/internal/default-logging-settings'
import { DefaultReconnectionSettings } from './settings/internal/default-reconnection-settings'
import { DefaultCommunicationSettings } from './settings/internal/default-communication-settings'
import { DefaultRegularInvocationSettings } from './settings/internal/default-regular-invocation-settings'

// TODO: validate options
export class ClientBuilder {
  public build(url: string): IClient
  public build(url: string, options: ClientOptions): IClient
  public build(url: string, options: ClientOptions = {}): IClient {
    if (!StringHelper.isString(url)) {
      throw new TypeError('Invalid url type. Expected type: string')
    }

    if (!ObjectHelper.isPlainObject(options)) {
      throw new TypeError('Invalid options type. Expected type: plain object')
    }

    options = {
      logging: { ...new DefaultLoggingSettings(), ...options?.logging },
      reconnection: {
        ...new DefaultReconnectionSettings(),
        ...options?.reconnection
      },
      communication: {
        ...new DefaultCommunicationSettings(),
        ...options?.communication
      },
      invocation: {
        ...new DefaultRegularInvocationSettings(),
        ...options?.invocation
      }
    }

    if (!options.communication!.protocols!.length) {
      options.communication!.protocols!.push(new JsonProtocol())
    }

    const webSocketClientFactory = new WebSocketClientFactory()

    return new Client(
      url,
      options.reconnection as ReconnectionSettings,
      options.communication as CommunicationSettings,
      options.invocation as InvocationSettings,
      webSocketClientFactory,
      options.logging!.logger!
    )
  }
}
