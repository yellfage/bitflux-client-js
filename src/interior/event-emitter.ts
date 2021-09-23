import type { PlainObject } from '../plain-object'

import { removeFromArray } from './array-utils'

import type { Callback } from './callback'

export class EventEmitter<TEventHandlerMap extends Record<string, Callback>> {
  private readonly handlers: PlainObject<Callback[] | undefined>

  public constructor() {
    this.handlers = {}
  }

  public on<TEventName extends keyof TEventHandlerMap>(
    eventName: TEventName,
    handler: TEventHandlerMap[TEventName]
  ): TEventHandlerMap[TEventName] {
    const handlers: Callback[] = this.handlers[eventName] ?? []

    if (!handlers.length) {
      this.handlers[eventName] = handlers
    }

    handlers.push(handler)

    return handler
  }

  public off<TEventName extends keyof TEventHandlerMap>(
    eventName: TEventName,
    handler: TEventHandlerMap[TEventName]
  ): void {
    removeFromArray(this.handlers[eventName] ?? [], handler)
  }

  public async emit<TEventName extends keyof TEventHandlerMap>(
    eventName: TEventName,
    ...args: Parameters<TEventHandlerMap[TEventName]>
  ): Promise<void> {
    for (const handler of this.handlers[eventName] ?? []) {
      // eslint-disable-next-line no-await-in-loop
      await handler(...args)
    }
  }
}
