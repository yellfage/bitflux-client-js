import type { State } from '../state'

enum Value {
  Connecting = 0,
  Connected = 1,
  Reconnecting = 2,
  Disconnected = 3,
  Terminating = 4,
  Terminated = 5
}

const DEFAULT_VALUE = Value.Disconnected

export class MutableState implements State {
  public get isConnecting(): boolean {
    return this.value === Value.Connecting
  }

  public get isConnected(): boolean {
    return this.value === Value.Connected
  }

  public get isReconnecting(): boolean {
    return this.value === Value.Reconnecting
  }

  public get isDisconnected(): boolean {
    return this.value === Value.Disconnected
  }

  public get isTerminating(): boolean {
    return this.value === Value.Terminating
  }

  public get isTerminated(): boolean {
    return this.value === Value.Terminated
  }

  private value: Value

  public constructor() {
    this.value = DEFAULT_VALUE
  }

  public setConnecting(): void {
    this.value = Value.Connecting
  }

  public setConnected(): void {
    this.value = Value.Connected
  }

  public setReconnecting(): void {
    this.value = Value.Reconnecting
  }

  public setDisconnected(): void {
    this.value = Value.Disconnected
  }

  public setTerminating(): void {
    this.value = Value.Terminating
  }

  public setTerminated(): void {
    this.value = Value.Terminated
  }

  public reset(): void {
    this.value = DEFAULT_VALUE
  }
}
