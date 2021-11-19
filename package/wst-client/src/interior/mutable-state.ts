import type { State } from '../state'

enum Value {
  Disconnected = 0,
  Connecting = 1,
  Connected = 2,
  Reconnecting = 3,
  Terminating = 4,
  Terminated = 5
}

export class MutableState implements State {
  public get isDisconnected(): boolean {
    return this.value === Value.Disconnected
  }

  public get isConnecting(): boolean {
    return this.value === Value.Connecting
  }

  public get isConnected(): boolean {
    return this.value === Value.Connected
  }

  public get isReconnecting(): boolean {
    return this.value === Value.Reconnecting
  }

  public get isTerminating(): boolean {
    return this.value === Value.Terminating
  }

  public get isTerminated(): boolean {
    return this.value === Value.Terminated
  }

  private value = Value.Disconnected

  public setDisconnected(): void {
    this.value = Value.Disconnected
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

  public setTerminating(): void {
    this.value = Value.Terminating
  }

  public setTerminated(): void {
    this.value = Value.Terminated
  }
}
