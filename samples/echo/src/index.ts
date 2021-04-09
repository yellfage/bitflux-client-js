import { ClientBuilder } from '../../../src'

const client = new ClientBuilder().build('wss://localhost:5001/ws', {
  reconnection: {
    attemptsDelays: [1000, 2000, 3000],
    maxAttemptsAfterDelays: 0
  }
})

client.starting.add(() => console.log('Starting'))
client.connecting.add(() => console.log('Connecting'))
client.connected.add(() => console.log('Connected'))
client.reconnecting.add(() => console.log('Reconnecting'))
client.disconnected.add(() => console.log('Disconnected'))
client.terminated.add(() => console.log('Terminated'))
client.started.add(() => console.log('Started'))
client.reconnected.add(() => console.log('Reconnected'))
client.invocation.add(() => console.log('Invocation'))
client.invocationCompletion.add(() => console.log('Invocation completion'))
client.incomingInvocation.add(() => console.log('Incoming invocation'))

client.onNotification('Echo', (message: string) =>
  console.log(`Incoming notification message: ${message}`)
)

//
;(async () => {
  await client.start()

  const result = await client.invoke<string>('Echo', 'Message')

  console.log(`Invocation result: ${result}`)

  await client.notify('Echo', 'Notification message')
})()
