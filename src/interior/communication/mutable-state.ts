import { State } from './state'

enum Value {
  Connecting,
  Connected,
  Reconnecting,
  Disconnected,
  Terminating,
  Terminated
}

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

  private value

  public constructor() {
    this.value = Value.Terminated
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
}