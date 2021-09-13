/* eslint-disable no-console */
import { WstClientFactory, DefaultReconnectionPolicy } from '../../../src'

const client = new WstClientFactory().create(
  'wss://localhost:5001/ws',
  (options) => {
    options.reconnection.policy = new DefaultReconnectionPolicy({
      delays: [],
      maxAttemptsAfterDelays: -1
    })
  }
)

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
  client.notifyCarelessly('Notify', {
    message: 'The lost notifiable invocation message'
  })

  client.notify('Notify', {
    message: 'The cached notifiable invocation message'
  })

  await client.start()

  await client.invoke('Authenticate')

  const result = await client.invoke<string>('Echo', {
    message: 'The regular invocation message'
  })

  console.log(`The invocation result: ${result}`)

  client.notify('Notify', {
    message: 'The notifiable invocation message #1'
  })

  client.notify('Notify', {
    message: 'The notifiable invocation message #2'
  })

  client.notify('Notify', {
    message: 'The notifiable invocation message #3'
  })
})()
