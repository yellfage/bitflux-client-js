import {
  WebSocketClient,
  WebSocketMessageEvent,
  OutgoingRegularInvocationMessage,
  IncomingSuccessfulRegularInvocationResultMessage,
  IncomingFailedRegularInvocationResultMessage,
  IncomingRegularInvocationResultMessage
} from './communication'

import { RegularInvocationShape } from './regular-invocation-shape'
import { DeferredPromise } from './deferred-promise'

import { IncomingMessage, IncomingMessageType } from '../communication'
import { InvocationAbortedError } from '../invocation-aborted-error'

export class RegularInvocation {
  private webSocket: WebSocketClient

  private shape: RegularInvocationShape

  private message: OutgoingRegularInvocationMessage

  private deferredPromise: DeferredPromise<any>

  private rejectionTimeout: number
  private attemptRejectionTimeout: number

  public constructor(
    webSocket: WebSocketClient,
    shape: RegularInvocationShape
  ) {
    this.webSocket = webSocket

    this.shape = shape

    this.message = new OutgoingRegularInvocationMessage(
      shape.handlerName,
      shape.args,
      shape.id
    )

    this.deferredPromise = new DeferredPromise()

    this.rejectionTimeout = 0
    this.attemptRejectionTimeout = 0
  }

  public perform(): Promise<any> {
    this.registerWebSocketHandlers()

    this.registerAbortionHandler()

    this.runRejectionTimeout()

    this.sendMessage()

    return this.deferredPromise.promise
  }

  private registerWebSocketHandlers(): void {
    this.webSocket.on('disconnected', this.handleDisconnect)
    this.webSocket.on('connected', this.handleConnect)
    this.webSocket.on('terminating', this.handleTerminating)
    this.webSocket.on('message', this.handleMessage)
  }

  private unregisterWebSocketHandlers(): void {
    this.webSocket.off('disconnected', this.handleDisconnect)
    this.webSocket.off('connected', this.handleConnect)
    this.webSocket.off('terminating', this.handleTerminating)
    this.webSocket.off('message', this.handleMessage)
  }

  private registerAbortionHandler(): void {
    this.shape.abortController.signal.addEventListener(
      'abort',
      this.handleAbortion
    )
  }

  private unregisterAbortionHandler(): void {
    this.shape.abortController.signal.removeEventListener(
      'abort',
      this.handleAbortion
    )
  }

  private runRejectionTimeout(): void {
    this.rejectionTimeout = setTimeout(() => {
      this.handleResult(
        new InvocationAbortedError('The invocation aborted: timeout')
      )
    }, this.shape.rejectionDelay) as unknown as number
  }

  private runAttemptRejectionTimeout(): void {
    this.attemptRejectionTimeout = setTimeout(() => {
      this.handleResult(
        new InvocationAbortedError('The invocation aborted: attempt timeout')
      )
    }, this.shape.attemptRejectionDelay) as unknown as number
  }

  private clearRejectionTimeout(): void {
    clearTimeout(this.rejectionTimeout)
  }

  private clearAttemptRejectionTimeout(): void {
    clearTimeout(this.attemptRejectionTimeout)
  }

  private sendMessage(): void {
    this.webSocket.send(this.message)

    this.runAttemptRejectionTimeout()
  }

  private handleResult = (result: any): void => {
    this.clearRejectionTimeout()
    this.clearAttemptRejectionTimeout()

    this.unregisterWebSocketHandlers()
    this.unregisterAbortionHandler()

    if (result instanceof Error) {
      this.deferredPromise.reject(result)
    } else {
      this.deferredPromise.resolve(result)
    }
  }

  private handleAbortion = (): void => {
    this.handleResult(
      new InvocationAbortedError('The invocation aborted: manual abortion')
    )
  }

  private handleTerminating = (): void => {
    this.handleResult(
      new InvocationAbortedError('The invocation aborted: termination')
    )
  }

  private handleDisconnect = (): void => {
    this.clearAttemptRejectionTimeout()
  }

  private handleConnect = (): void => {
    this.sendMessage()
  }

  private handleMessage = ({
    data: message
  }: WebSocketMessageEvent<IncomingMessage>): void => {
    if (
      !this.isRegularInvocationResultMessage(message) ||
      !this.isInvocationIdMatching(message)
    ) {
      return
    }

    if (this.isSuccessfulRegularInvocationResultMessage(message)) {
      this.handleResult(message.value)
    } else if (this.isFailedRegularInvocationResultMessage(message)) {
      this.handleResult(new Error(message.error))
    }
  }

  private isRegularInvocationResultMessage(
    message: IncomingMessage
  ): message is IncomingRegularInvocationResultMessage {
    return (
      this.isSuccessfulRegularInvocationResultMessage(message) ||
      this.isFailedRegularInvocationResultMessage(message)
    )
  }

  private isSuccessfulRegularInvocationResultMessage(
    message: IncomingMessage
  ): message is IncomingSuccessfulRegularInvocationResultMessage {
    return (
      message.type === IncomingMessageType.SuccessfulRegularInvocationResult
    )
  }

  private isFailedRegularInvocationResultMessage(
    message: IncomingMessage
  ): message is IncomingFailedRegularInvocationResultMessage {
    return message.type === IncomingMessageType.FailedRegularInvocationResult
  }

  private isInvocationIdMatching(
    message: IncomingRegularInvocationResultMessage
  ): boolean {
    return this.shape.id === message.invocationId
  }
}
