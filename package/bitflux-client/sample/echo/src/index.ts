/* eslint-disable no-console */

import {
  BasicReconnectionControlBuilder,
  BasicReconnectionDelaySchemeBuilder,
  BitfluxClientBuilder,
} from '@yellfage/bitflux-client'

import { JsonProtocolBuilder } from '@yellfage/bitflux-client-json-protocol'

import { WebSocketTransportBuilder } from '@yellfage/bitflux-client-web-socket-transport'

const client = new BitfluxClientBuilder('https://localhost:5001/ws')
  .configureCommunication((builder) =>
    builder
      .addProtocolBuilder(new JsonProtocolBuilder())
      .addTransportBuilder(new WebSocketTransportBuilder().setUrlScheme('wss')),
  )
  .configureReconnection((builder) =>
    builder
      .setControlBuilder(
        new BasicReconnectionControlBuilder().setMaxAttempts(-1),
      )
      .setDelaySchemeBuilder(
        new BasicReconnectionDelaySchemeBuilder().setDelays([1000]),
      ),
  )
  .build()

client.on('connecting', (event) => console.log('Connecting', event))
client.on('connected', (event) => console.log('Connected', event))
client.on('reconnecting', (event) => console.log('Reconnecting', event))
client.on('disconnecting', (event) => console.log('Disconnecting', event))
client.on('disconnected', (event) => console.log('Disconnected', event))
client.on('invocation', (event) => console.log('Invocation', event))
client.on('invocationResult', (event) =>
  console.log('Invocation Result', event),
)

client.map('Notify', (message: string) => {
  console.log(`The incoming message: ${message}`)
})

//
;(async () => {
  await client
    .notify('Notify')
    .setArgs({
      message: 'The cached notifiable invocation message',
    })
    .perform()

  await client.connect()

  await client.invoke('Authenticate').perform()

  const result = await client
    .invoke<string>('Echo')
    .setArgs({
      message: 'The regular invocation message',
    })
    .perform()

  console.log(`The invocation result: ${result}`)

  await client
    .notify('Notify')
    .setArgs({
      message: 'The notifiable invocation message #1',
    })
    .perform()

  await client
    .notify('Notify')
    .setArgs({
      message: 'The notifiable invocation message #2',
    })
    .perform()

  await client
    .notify('Notify')
    .setArgs({
      message: 'The notifiable invocation message #3',
    })
    .perform()
})()
