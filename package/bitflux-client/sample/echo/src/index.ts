/* eslint-disable no-console */

import {
  BasicReconnectionSchemeBuilder,
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
    builder.setSchemeBuilder(
      new BasicReconnectionSchemeBuilder()
        .setDelays([1000])
        .setMaxAttemptsAfterDelays(-1),
    ),
  )
  .build()

client.on('connecting', (event) => console.log('Connecting', event))
client.on('connected', (event) => console.log('Connected', event))
client.on('reconnecting', (event) => console.log('Reconnecting', event))
client.on('disconnected', (event) => console.log('Disconnected', event))
client.on('terminating', (event) => console.log('Terminating', event))
client.on('terminated', (event) => console.log('Terminated', event))
client.on('reconnected', (event) => console.log('Reconnected', event))

client.map('Notify', (message: string) => {
  console.log(`The incoming message: ${message}`)
})

//
;(async () => {
  client
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

  client
    .notify('Notify')
    .setArgs({
      message: 'The notifiable invocation message #1',
    })
    .perform()

  client
    .notify('Notify')
    .setArgs({
      message: 'The notifiable invocation message #2',
    })
    .perform()

  client
    .notify('Notify')
    .setArgs({
      message: 'The notifiable invocation message #3',
    })
    .perform()
})()
