import { PlainObject } from '../plain-object'

import { ArrayUtils } from './array-utils'
import { Callback } from './callback'

export class EventEmitter<TEvents extends { [key: string]: Callback }> {
  private handlers: PlainObject<Callback[]>

  public constructor() {
    this.handlers = {}
  }

  public on<TEventName extends keyof TEvents>(
    eventName: TEventName,
    handler: TEvents[TEventName]
  ): TEvents[TEventName] {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }

    this.handlers[eventName].push(handler)

    return handler
  }

  public off<TEventName extends keyof TEvents>(
    eventName: TEventName,
    handler: TEvents[TEventName]
  ): void {
    ArrayUtils.remove(this.handlers[eventName] || [], handler)
  }

  public async emit<TEventName extends keyof TEvents>(
    eventName: TEventName,
    ...args: Parameters<TEvents[TEventName]>
  ): Promise<void> {
    for (const handler of this.handlers[eventName] || []) {
      await handler(...args)
    }
  }
}
