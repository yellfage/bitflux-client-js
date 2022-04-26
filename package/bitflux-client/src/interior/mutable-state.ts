import type { State } from '../state'

enum Value {
  Connecting = 0,
  Connected = 1,
  Disconnecting = 2,
  Disconnected = 3,
  Reconnecting = 4,
}

export class MutableState implements State {
  public get currentName(): string {
    return Value[this.value]
  }

  public get isConnecting(): boolean {
    return this.value === Value.Connecting
  }

  public get isConnected(): boolean {
    return this.value === Value.Connected
  }

  public get isDisconnecting(): boolean {
    return this.value === Value.Disconnecting
  }

  public get isDisconnected(): boolean {
    return this.value === Value.Disconnected
  }

  public get isReconnecting(): boolean {
    return this.value === Value.Reconnecting
  }

  private value = Value.Disconnected

  public setConnecting(): void {
    this.value = Value.Connecting
  }

  public setConnected(): void {
    this.value = Value.Connected
  }

  public setDisconnecting(): void {
    this.value = Value.Disconnecting
  }

  public setDisconnected(): void {
    this.value = Value.Disconnected
  }

  public setReconnecting(): void {
    this.value = Value.Reconnecting
  }
}
