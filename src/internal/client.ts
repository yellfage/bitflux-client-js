/* eslint-disable import/no-named-as-default */
/* eslint-disable node/no-callback-literal */

import { v4 as uuid4 } from 'uuid'
import delay from 'delay'
import AbortController from 'abort-controller'

import { IClient } from '../i-client'
import { EventHandlerStore } from './event-handler-store'
import { StartingEventHandler } from '../starting-event-handler'
import { ConnectingEventHandler } from '../connecting-event-handler'
import { ConnectedEventHandler } from '../connected-event-handler'
import { ReconnectingEventHandler } from '../reconnecting-event-handler'
import { DisconnectedEventHandler } from '../disconnected-event-handler'
import { TerminatedEventHandler } from '../terminated-event-handler'
import { StartedEventHandler } from '../started-event-handler'
import { ReconnectedEventHandler } from '../reconnected-event-handler'
import { InvocationEventHandler } from '../invocation-event-handler'
import { InvocationCompletionEventHandler } from '../invocation-completion-event-handler'
import { IncomingInvocationEventHandler } from '../incoming-invocation-event-handler'
import { NotifiableInvocationHandler } from '../notifiable-invocation-handler'
import { RegularInvocationDescriptor } from './regular-invocation-descriptor'
import { NotifiableInvocationDescriptor } from './notifiable-invocation-descriptor'
import { RegularInvocationContext } from './regular-invocation-context'

import { ArrayHelper } from './array-helper'
import { ObjectHelper } from './object-helper'
import { FunctionHelper } from './function-helper'
import { DeferredPromise } from './deferred-promise'

import {
  CommunicationSettings,
  ReconnectionSettings,
  InvocationSettings
} from '../settings'

import { Callback } from './callback'
import {
  IncomingFailedRegularInvocationCompletionMessage,
  IncomingMessage,
  IncomingMessageType,
  IncomingNotifiableInvocationMessage,
  IncomingRegularInvocationCompletionMessage,
  IncomingSuccessRegularInvocationCompletionMessage,
  IProtocol,
  OutgoingMessage,
  OutgoingNotifiableInvocationMessage,
  OutgoingRegularInvocationMessage
} from '../communication'
import { ReconnectionContext } from './reconnection-context'
import { IWebSocketClientFactory } from './i-web-socket-client-factory'
import { ILogger } from '../i-logger'

import { IWebSocketClient } from '../communication/internal/i-web-socket-client'
import { WebSocketMessageEvent } from '../communication/internal/web-socket-message-event'
import { WebSocketCloseEvent } from '../communication/internal/web-socket-close-event'

import { ClientState } from '../client-state'
import { WebSocketState } from '../communication/internal/web-socket-state'
import { WebSocketCloseStatus } from '../web-socket-close-status'

import { StringHelper } from './string-helper'
import { InvalidOperationError } from '../invalid-operation-error'
import { UnableStartupError } from '../unable-startup-error'
import { InvocationAbortedError } from '../invocation-aborted-error'
import { InvalidInvocationError } from '../invalid-invocation-error'
import { InvocationSetup } from '../invocation-setup'
import { InvocationResult } from '../invocation-result'
import { RegularInvocationSetup } from '../regular-invocation-setup'
import { NotifiableInvocationSetup } from '../notifiable-invocation-setup'

export class Client implements IClient {
  public uri: string
  public state: ClientState

  public readonly starting: EventHandlerStore<StartingEventHandler>
  public readonly connecting: EventHandlerStore<ConnectingEventHandler>
  public readonly connected: EventHandlerStore<ConnectedEventHandler>
  public readonly reconnecting: EventHandlerStore<ReconnectingEventHandler>
  public readonly disconnected: EventHandlerStore<DisconnectedEventHandler>
  public readonly terminated: EventHandlerStore<TerminatedEventHandler>

  public readonly started: EventHandlerStore<StartedEventHandler>
  public readonly reconnected: EventHandlerStore<ReconnectedEventHandler>

  public readonly invocation: EventHandlerStore<InvocationEventHandler>

  public readonly invocationCompletion: EventHandlerStore<InvocationCompletionEventHandler>

  public readonly incomingInvocation: EventHandlerStore<IncomingInvocationEventHandler>

  public get isStarting(): boolean {
    return this.state === ClientState.Starting
  }

  public get isConnecting(): boolean {
    return this.state === ClientState.Connecting
  }

  public get isConnected(): boolean {
    return this.state === ClientState.Connected
  }

  public get isReconnecting(): boolean {
    return this.state === ClientState.Reconnecting
  }

  public get isDisconnected(): boolean {
    return this.state === ClientState.Disconnected
  }

  public get isTerminated(): boolean {
    return this.state === ClientState.Terminated
  }

  private readonly reconnectionSettings: ReconnectionSettings
  private readonly communicationSettings: CommunicationSettings
  private readonly invocationSettings: InvocationSettings

  private logger: ILogger
  private webSocketClient: IWebSocketClient | null
  private subProtocolNames: string[]
  private protocol: IProtocol | null

  private reconnectionContext: ReconnectionContext

  private readonly notifiableInvocationHandlers: Record<
    string,
    NotifiableInvocationHandler
  >

  private pendingRegularInvocationDescriptors: RegularInvocationDescriptor[]
  private suspendedRegularInvocationDescriptors: Set<RegularInvocationDescriptor>
  private suspendedNotifiableInvocationDescriptors: Set<NotifiableInvocationDescriptor>

  private webSocketClientFactory: IWebSocketClientFactory

  public constructor(
    uri: string,
    reconnectionSettings: ReconnectionSettings,
    communicationSettings: CommunicationSettings,
    invocationSettings: InvocationSettings,
    webSocketClientFactory: IWebSocketClientFactory,
    logger: ILogger
  ) {
    this.uri = uri
    this.state = ClientState.Terminated

    this.starting = new EventHandlerStore()
    this.connecting = new EventHandlerStore()
    this.connected = new EventHandlerStore()
    this.reconnecting = new EventHandlerStore()
    this.disconnected = new EventHandlerStore()
    this.terminated = new EventHandlerStore()
    this.started = new EventHandlerStore()
    this.reconnected = new EventHandlerStore()
    this.invocation = new EventHandlerStore()
    this.invocationCompletion = new EventHandlerStore()
    this.incomingInvocation = new EventHandlerStore()

    this.reconnectionSettings = reconnectionSettings
    this.communicationSettings = communicationSettings
    this.invocationSettings = invocationSettings

    this.logger = logger
    this.webSocketClient = null
    this.subProtocolNames = communicationSettings.protocols.map(
      (protocol) => protocol.name
    )

    this.reconnectionContext = new ReconnectionContext(new AbortController())
    this.notifiableInvocationHandlers = {}
    this.pendingRegularInvocationDescriptors = []
    this.suspendedRegularInvocationDescriptors = new Set()
    this.suspendedNotifiableInvocationDescriptors = new Set()

    this.webSocketClientFactory = webSocketClientFactory
  }

  public async start(uri = this.uri): Promise<void> {
    if (!StringHelper.isString(uri)) {
      throw new TypeError('Invalid uri type. Expected type: string')
    }

    if (!this.isTerminated) {
      throw new InvalidOperationError(
        "The client cannot be started because it is not in the 'Terminated' state"
      )
    }

    this.state = ClientState.Starting

    await this.emitStartingEvent()

    // Check if a "starting" event handler has called stop()
    if (!this.isStarting) {
      throw new UnableStartupError('The client was terminated during startup')
    }

    await this.connect(uri)

    if (!this.isConnected) {
      throw new UnableStartupError(
        'Failed to establish a connection or the client was terminated after connection'
      )
    }

    await this.emitStartedEvent()
  }

  public async stop(): Promise<void> {
    if (this.state === ClientState.Terminated) {
      throw new InvalidOperationError(
        "The client cannot be stopped because it is already in the 'Terminated' state"
      )
    }

    await this.terminate('Stopping')
  }

  public onNotification(
    handlerName: string,
    handler: NotifiableInvocationHandler
  ): void {
    if (!StringHelper.isString(handlerName)) {
      throw new TypeError('Invalid handlerName type. Expected type: string')
    }

    if (!FunctionHelper.isFunction(handler)) {
      throw new TypeError('Invalid handler type. Expected type: function')
    }

    this.notifiableInvocationHandlers[handlerName] = handler
  }

  public offNotification(handlerName: string): void {
    if (!StringHelper.isString(handlerName)) {
      throw new TypeError('Invalid handlerName type. Expected type: string')
    }

    delete this.notifiableInvocationHandlers[handlerName]
  }

  public invoke(...args: any[]): Promise<any> {
    if (ObjectHelper.isPlainObject(args[0])) {
      return this.invokeCore(args[0] as RegularInvocationSetup)
    } else if (FunctionHelper.isFunction(args[0])) {
      const setup = this.createRegularInvocationSetup('', [])

      args[0](setup)

      return this.invoke(setup)
    } else {
      const setup = this.createRegularInvocationSetup(args[0], args.slice(1))

      return this.invoke(setup)
    }
  }

  public async notify(...args: any[]): Promise<void> {
    if (ObjectHelper.isPlainObject(args[0])) {
      await this.notifyCore(args[0] as NotifiableInvocationSetup)
    } else if (FunctionHelper.isFunction(args[0])) {
      const setup = this.createNotifiableInvocationSetup('', [])

      args[0](setup)

      await this.notify(setup)
    } else {
      const setup = this.createNotifiableInvocationSetup(args[0], args.slice(1))

      await this.notify(setup)
    }
  }

  // TODO: validate setup
  private async invokeCore(setup: RegularInvocationSetup): Promise<any> {
    const descriptor = this.createRegularInvocationDescriptor(setup)

    await this.emitInvocationEvent(descriptor.setup)

    this.pendingRegularInvocationDescriptors.push(descriptor)

    this.registerRegularInvocationAbortionHandler(descriptor)
    this.runRegularInvocationRejectionTimeout(descriptor)

    if (!setup.abortController.signal.aborted) {
      if (this.isConnected) {
        this.performRegularInvocation(descriptor)
      } else {
        this.suspendedRegularInvocationDescriptors.add(descriptor)
      }
    }

    return descriptor.context.deferredPromise.promise
  }

  // TODO: validate setup
  private async notifyCore(setup: NotifiableInvocationSetup): Promise<void> {
    const descriptor = this.createNotifiableInvocationDescriptor(setup)

    await this.emitInvocationEvent(descriptor.setup)

    if (this.isConnected) {
      this.performNotifiableInvocation(descriptor)
    } else {
      this.suspendedNotifiableInvocationDescriptors.add(descriptor)
    }
  }

  private async terminate(reason: string): Promise<void> {
    this.abortReconnection()
    this.clearSuspendedRegularInvocationDescriptors()
    this.clearSuspendedNotifiableInvocationDescriptors()

    await this.abortPendingRegularInvocations()

    if (this.webSocketClient) {
      this.webSocketClient.onopen = null
      this.webSocketClient.onclose = null
      this.webSocketClient.onmessage = null

      if (this.webSocketClient.state === WebSocketState.Open) {
        await this.stop()
      }
    }

    this.webSocketClient = null

    this.state = ClientState.Terminated

    this.emitTerminatedEvent(reason)
  }

  private async connect(uri: string): Promise<void> {
    this.state = ClientState.Connecting

    await this.emitConnectingEvent()

    // Check if a "connecting" event handler has called stop()
    if (!this.isConnecting) {
      return
    }

    this.webSocketClient = this.webSocketClientFactory.create(
      uri,
      this.subProtocolNames
    )

    this.webSocketClient.onopen = this.handleWebSocketOpenEvent
    this.webSocketClient.onclose = this.handleWebSocketCloseEvent
    this.webSocketClient.onmessage = this.handleWebSocketMessageEvent

    try {
      await this.webSocketClient.start()
    } catch (error) {
      // Check if stop() was called during startup
      if (this.isTerminated) {
        return
      }

      this.logger.logError(`Unable to establish a connection: ${error}`)

      await this.reconnect()
    }
  }

  private async reconnect(): Promise<void> {
    if (this.arePrimaryReconnectionAttemptsExhausted()) {
      if (this.isMaxReconnectionAttemptsAfterDelaysReached()) {
        await this.terminate('Max reconnection attempts reached')

        return
      }

      this.reconnectionContext.increaseAttemptsAfterDelays()
    } else {
      this.reconnectionContext.increaseAttemptDelayIndex()
    }

    const originalAttemptDelay = this.resolveOriginalReconnectionAttemptDelay()

    const attemptDelayAddition = this.resolveReconnectionAttemptDelayAddition()

    const attemptDelay = originalAttemptDelay + attemptDelayAddition

    this.state = ClientState.Reconnecting

    await this.emitReconnectingEvent(attemptDelay, originalAttemptDelay)

    // Check if a "reconnecting" event handler has called stop()
    if (!this.isReconnecting) {
      return
    }

    if (Number.isNaN(attemptDelay) || attemptDelay <= 0) {
      await this.connect(this.uri)

      return
    }

    if (this.reconnectionContext.abortController.signal.aborted) {
      this.reconnectionContext.abortController = new AbortController()
    }

    try {
      await delay(attemptDelay, {
        signal: this.reconnectionContext.abortController.signal
      })

      await this.connect(this.uri)
    } catch {}
  }

  private arePrimaryReconnectionAttemptsExhausted(): boolean {
    return (
      !this.reconnectionSettings.attemptsDelays.length ||
      this.reconnectionContext.attemptDelayIndex ===
        this.reconnectionSettings.attemptsDelays.length - 1
    )
  }

  private isMaxReconnectionAttemptsAfterDelaysReached(): boolean {
    return (
      this.reconnectionContext.attemptsAfterDelays ===
      this.reconnectionSettings.maxAttemptsAfterDelays
    )
  }

  private resolveOriginalReconnectionAttemptDelay(): number {
    return this.reconnectionSettings.attemptsDelays[
      this.reconnectionContext.attemptDelayIndex
    ]
  }

  private resolveReconnectionAttemptDelayAddition(): number {
    return this.generateRandomInt(
      this.reconnectionSettings.minAttemptDelayAddition,
      this.reconnectionSettings.maxAttemptDelayAddition
    )
  }

  private abortReconnection(): void {
    this.reconnectionContext.reset()

    this.reconnectionContext.abortController.abort()
  }

  private transmitMessage(message: OutgoingMessage): void {
    this.webSocketClient!.send(this.protocol!.serialize(message))
  }

  private performRegularInvocation(
    descriptor: RegularInvocationDescriptor
  ): void {
    const message: OutgoingRegularInvocationMessage = new OutgoingRegularInvocationMessage(
      descriptor.setup.handlerName,
      descriptor.setup.args,
      descriptor.context.id
    )

    this.transmitMessage(message)

    this.runRegularInvocationAttemptRejectionTimeout(descriptor)
  }

  private performNotifiableInvocation(
    descriptor: NotifiableInvocationDescriptor
  ): void {
    const message = new OutgoingNotifiableInvocationMessage(
      descriptor.setup.handlerName,
      descriptor.setup.args
    )

    this.transmitMessage(message)
  }

  private performSuspendedRegularInvocations(): void {
    this.suspendedRegularInvocationDescriptors.forEach((descriptor) =>
      this.performRegularInvocation(descriptor)
    )

    this.clearSuspendedRegularInvocationDescriptors()
  }

  private performSuspendedNotifiableInvocations(): void {
    this.suspendedNotifiableInvocationDescriptors.forEach((descriptor) =>
      this.performNotifiableInvocation(descriptor)
    )

    this.clearSuspendedNotifiableInvocationDescriptors()
  }

  private suspendPendingRegularInvocations(): void {
    this.pendingRegularInvocationDescriptors.forEach((descriptor) => {
      this.clearRegularInvocationAttemptRejectionTimeout(descriptor.context)

      this.suspendedRegularInvocationDescriptors.add(descriptor)
    })
  }

  // We do not call AbortController.abort() because we want to wait
  // for all pending regular invocations to be aborted during termination
  private async abortPendingRegularInvocations(): Promise<void> {
    await Promise.all(
      this.pendingRegularInvocationDescriptors.map((descriptor) =>
        this.finishRegularInvocationDueToAbortion(descriptor)
      )
    )
  }

  private runRegularInvocationRejectionTimeout(
    descriptor: RegularInvocationDescriptor
  ): void {
    const { rejectionDelay } = descriptor.setup

    if (Number.isNaN(rejectionDelay) || rejectionDelay <= 0) {
      return
    }

    descriptor.context.rejectionTimeoutId = (setTimeout(
      async () => await this.finishRegularInvocationDueToTimeout(descriptor),
      rejectionDelay
    ) as unknown) as number
  }

  private runRegularInvocationAttemptRejectionTimeout(
    descriptor: RegularInvocationDescriptor
  ): void {
    const { attemptRejectionDelay } = descriptor.setup

    if (Number.isNaN(attemptRejectionDelay) || attemptRejectionDelay <= 0) {
      return
    }

    descriptor.context.attemptRejectionTimeoutId = (setTimeout(
      async () => await this.finishRegularInvocationDueToTimeout(descriptor),
      attemptRejectionDelay
    ) as unknown) as number
  }

  private clearRegularInvocationRejectionTimeout(
    context: RegularInvocationContext
  ): void {
    clearTimeout(context.rejectionTimeoutId)
  }

  private clearRegularInvocationAttemptRejectionTimeout(
    context: RegularInvocationContext
  ): void {
    clearTimeout(context.attemptRejectionTimeoutId)
  }

  private clearSuspendedRegularInvocationDescriptors(): void {
    if (this.suspendedRegularInvocationDescriptors.size > 0) {
      this.suspendedRegularInvocationDescriptors = new Set()
    }
  }

  private clearSuspendedNotifiableInvocationDescriptors(): void {
    if (this.suspendedNotifiableInvocationDescriptors.size > 0) {
      this.suspendedNotifiableInvocationDescriptors = new Set()
    }
  }

  private createRegularInvocationSetup(
    handlerName: string,
    args: any[]
  ): RegularInvocationSetup {
    return {
      handlerName,
      args,
      rejectionDelay: this.invocationSettings.rejectionDelay,
      attemptRejectionDelay: this.invocationSettings.attemptRejectionDelay,
      abortController: new AbortController()
    }
  }

  private createNotifiableInvocationSetup(
    handlerName: string,
    args: any[]
  ): NotifiableInvocationSetup {
    return {
      handlerName,
      args
    }
  }

  private createRegularInvocationDescriptor(
    setup: RegularInvocationSetup
  ): RegularInvocationDescriptor {
    return { setup, context: this.createRegularInvocationContext() }
  }

  private createRegularInvocationContext(): RegularInvocationContext {
    return {
      id: uuid4(),
      deferredPromise: new DeferredPromise(),
      rejectionTimeoutId: 0,
      attemptRejectionTimeoutId: 0,
      abortionHandler: () => {
        throw new Error('An abortion handler cannot be called manually')
      }
    }
  }

  private createNotifiableInvocationDescriptor(
    setup: NotifiableInvocationSetup
  ): NotifiableInvocationDescriptor {
    return { setup, context: {} }
  }

  private registerRegularInvocationAbortionHandler(
    descriptor: RegularInvocationDescriptor
  ): void {
    descriptor.context.abortionHandler = async () =>
      await this.finishRegularInvocationDueToAbortion(descriptor)

    descriptor.setup.abortController.signal.addEventListener(
      'abort',
      descriptor.context.abortionHandler
    )
  }

  private async finishRegularInvocationDueToTimeout(
    descriptor: RegularInvocationDescriptor
  ): Promise<void> {
    await this.finishRegularInvocationDueToError(
      descriptor,
      new InvocationAbortedError('Invocation timeout')
    )
  }

  private async finishRegularInvocationDueToAbortion(
    descriptor: RegularInvocationDescriptor
  ): Promise<void> {
    await this.finishRegularInvocationDueToError(
      descriptor,
      new InvocationAbortedError('Invocation aborted')
    )
  }

  private async finishRegularInvocationDueToError(
    descriptor: RegularInvocationDescriptor,
    error: Error
  ): Promise<void> {
    await this.processRegularInvocationResult(descriptor, { payload: error })
  }

  private async processRegularInvocationResult(
    descriptor: RegularInvocationDescriptor,
    result: InvocationResult
  ): Promise<void> {
    this.clearRegularInvocationRejectionTimeout(descriptor.context)
    this.clearRegularInvocationAttemptRejectionTimeout(descriptor.context)

    await this.emitInvocationCompletionEvent(result, descriptor.setup)

    if (result.payload instanceof Error) {
      descriptor.context.deferredPromise.reject(result.payload)
    } else {
      descriptor.context.deferredPromise.resolve(result.payload)
    }

    descriptor.setup.abortController.signal.removeEventListener(
      'abort',
      descriptor.context.abortionHandler!
    )

    ArrayHelper.remove(this.pendingRegularInvocationDescriptors, descriptor)
  }

  private async processRegularInvocationCompletionMessage(
    message: IncomingRegularInvocationCompletionMessage
  ): Promise<void> {
    const descriptor = this.findPendingRegularInvocationDescriptor(
      message.invocationId
    )

    if (!descriptor) {
      return
    }

    let result: InvocationResult

    if (this.isSuccessRegularInvocationCompletionMessage(message)) {
      result = { payload: message.payload }
    } else if (this.isFailedRegularInvocationCompletionMessage(message)) {
      result = { payload: new InvalidInvocationError(message.error || '') }
    } else {
      throw new InvalidOperationError(
        'Unable to process an incoming regular ' +
          'invocation completion message: the message type is unknown'
      )
    }

    await this.processRegularInvocationResult(descriptor, result)
  }

  private async processNotifiableInvocationMessage(
    message: IncomingNotifiableInvocationMessage
  ): Promise<void> {
    const handler = this.notifiableInvocationHandlers[message.handlerName]

    if (!handler) {
      this.logger.logWarning(
        'Cannot process incoming notifiable invocation: ' +
          `the '${message.handlerName}' handler not found`
      )

      return
    }

    await this.emitIncomingInvocationEvent(message.handlerName, message.args)

    await Promise.resolve(handler(message.args))
  }

  private findPendingRegularInvocationDescriptor(
    id: string
  ): RegularInvocationDescriptor | undefined {
    return this.pendingRegularInvocationDescriptors.find(
      (descriptor) => descriptor.context.id === id
    )
  }

  private resolveNegotiatedProtocol(): IProtocol {
    return this.communicationSettings.protocols.find(
      (protocol) => protocol.name === this.webSocketClient!.subProtocol
    )!
  }

  private isNotifiableInvocationMessage(
    message: IncomingMessage
  ): message is IncomingNotifiableInvocationMessage {
    return message.type === IncomingMessageType.NotifiableInvocation
  }

  private isRegularInvocationCompletionMessage(
    message: IncomingMessage
  ): message is IncomingRegularInvocationCompletionMessage {
    return (
      this.isSuccessRegularInvocationCompletionMessage(message) ||
      this.isFailedRegularInvocationCompletionMessage(message)
    )
  }

  private isSuccessRegularInvocationCompletionMessage(
    message: IncomingMessage
  ): message is IncomingSuccessRegularInvocationCompletionMessage {
    return (
      message.type === IncomingMessageType.SuccessRegularInvocationCompletion
    )
  }

  private isFailedRegularInvocationCompletionMessage(
    message: IncomingMessage
  ): message is IncomingFailedRegularInvocationCompletionMessage {
    return (
      message.type === IncomingMessageType.FailedRegularInvocationCompletion
    )
  }

  private async emitStartingEvent(): Promise<void> {
    if (!this.starting.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.starting.handlers, {})
  }

  private async emitConnectingEvent(): Promise<void> {
    if (!this.connecting.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.connecting.handlers, {})
  }

  private async emitConnectedEvent(): Promise<void> {
    if (!this.connected.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.connected.handlers, {})
  }

  private async emitReconnectingEvent(
    attemptDelay: number,
    originalAttemptDelay: number
  ): Promise<void> {
    if (!this.reconnecting.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.reconnecting.handlers, {
      attemptDelay,
      originalAttemptDelay
    })
  }

  private async emitDisconnectedEvent(
    status?: WebSocketCloseStatus,
    statusDescription?: string
  ): Promise<void> {
    if (!this.disconnected.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.disconnected.handlers, {
      status,
      statusDescription
    })
  }

  private async emitTerminatedEvent(reason: string): Promise<void> {
    if (!this.terminated.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.terminated.handlers, { reason })
  }

  private async emitStartedEvent(): Promise<void> {
    if (!this.started.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.started.handlers, {})
  }

  private async emitReconnectedEvent(): Promise<void> {
    if (!this.reconnected.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.reconnected.handlers, {})
  }

  private async emitInvocationEvent(setup: InvocationSetup): Promise<void> {
    if (!this.invocation.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.invocation.handlers, { setup })
  }

  private async emitInvocationCompletionEvent(
    result: InvocationResult,
    setup: InvocationSetup
  ): Promise<void> {
    if (!this.invocationCompletion.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.invocationCompletion.handlers, {
      result,
      setup
    })
  }

  private async emitIncomingInvocationEvent(
    handlerName: string,
    args: any[]
  ): Promise<void> {
    if (!this.incomingInvocation.handlers.length) {
      return
    }

    await this.promisfyCallbacks(this.incomingInvocation.handlers, {
      handlerName,
      args
    })
  }

  private promisfyCallbacks<TCallback extends Callback>(
    callbacks: TCallback[],
    ...args: Parameters<TCallback>
  ): Promise<any[]> {
    return Promise.all(
      callbacks.map((callback) => Promise.resolve(callback(...args)))
    )
  }

  private generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private handleWebSocketOpenEvent = async (): Promise<void> => {
    this.uri = this.webSocketClient!.uri

    this.protocol = this.resolveNegotiatedProtocol()

    this.performSuspendedRegularInvocations()
    this.performSuspendedNotifiableInvocations()

    this.state = ClientState.Connected

    await this.emitConnectedEvent()

    // Check if a "connected" event handler has called stop()
    if (!this.isConnected) {
      return
    }

    if (this.reconnectionContext.isReconnectionPerforming()) {
      await this.emitReconnectedEvent()

      this.reconnectionContext.reset()
    }

    // Check if a "reconnected" event handler has called stop()
    if (!this.isConnected) {
      // eslint-disable-next-line no-useless-return
      return
    }
  }

  private handleWebSocketCloseEvent = async (
    event: WebSocketCloseEvent
  ): Promise<void> => {
    this.state = ClientState.Disconnected

    this.suspendPendingRegularInvocations()

    this.emitDisconnectedEvent(event.status, event.statusDescription)

    // Check if a "disconnected" event handler has called stop()
    if (!this.isDisconnected) {
      return
    }

    if (
      !this.reconnectionSettings.confirm({
        closeStatus: event.status,
        closeStatusDescription: event.statusDescription
      })
    ) {
      await this.terminate(
        `Disconnected. Status: ${event.status}. Status description: ${event.statusDescription}`
      )

      return
    }

    await this.reconnect()
  }

  private handleWebSocketMessageEvent = async (
    event: WebSocketMessageEvent
  ): Promise<void> => {
    const message = this.protocol!.deserialize(event.data)

    if (this.isNotifiableInvocationMessage(message)) {
      await this.processNotifiableInvocationMessage(message)
    } else if (this.isRegularInvocationCompletionMessage(message)) {
      await this.processRegularInvocationCompletionMessage(message)
    }
  }
}
