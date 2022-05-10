/* eslint-disable no-console */

import {
  BasicReconnectionControlBuilder,
  BasicReconnectionDelaySchemeBuilder,
  BitfluxClientBuilder,
} from '@yellfage/bitflux-client'

import { JsonProtocolBuilder } from '@yellfage/bitflux-client-json-protocol'

import { WebSocketTransportBuilder } from '@yellfage/bitflux-client-web-socket-transport'

import { SampleClientPluginBuilder } from './sample-client-plugin-builder'

import { SampleInvocationPluginBuilder } from './sample-invocation-plugin-builder'

const client = new BitfluxClientBuilder('https://localhost:5001/ws')
  .configureCommunication((builder) =>
    builder
      .addProtocolBuilder(new JsonProtocolBuilder())
      .addTransportBuilder(new WebSocketTransportBuilder().setUrlScheme('wss')),
  )
  .configureReconnection((builder) =>
    builder
      .setControl(new BasicReconnectionControlBuilder().setMaxAttempts(-1))
      .setDelayScheme(
        new BasicReconnectionDelaySchemeBuilder().setDelays([1000]),
      ),
  )
  .build()

client.use(new SampleClientPluginBuilder())

client.connecting.add((event) => console.log('Connecting', event))
client.connected.add((event) => console.log('Connected', event))
client.reconnecting.add((event) => console.log('Reconnecting', event))
client.disconnecting.add((event) => console.log('Disconnecting', event))
client.disconnected.add((event) => console.log('Disconnected', event))
client.invocating.add((event) => console.log('Invocating', event))
client.replying.add((event) => console.log('Replying', event))

client.map('Notify', (message: string) => {
  console.log(`The incoming message: ${message}`)
})

//
;(async () => {
  await client
    .notify('Notify', {
      message: 'The cached notifiable invocation message',
    })
    .perform()

  await client.connect()

  await client.invoke('Authenticate').perform()

  const result = await client
    .invoke<string>('Echo', {
      message: 'The regular invocation message',
    })
    .use(new SampleInvocationPluginBuilder())
    .perform()

  console.log(`The invocation result: ${result}`)

  await client
    .notify('Notify', {
      message: 'The notifiable invocation message #1',
    })
    .perform()

  await client
    .notify('Notify', {
      message: 'The notifiable invocation message #2',
    })
    .perform()

  await client
    .notify('Notify', {
      message: 'The notifiable invocation message #3',
    })
    .perform()
})()
