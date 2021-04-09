/* eslint-disable indent */
import { Callback } from './callback'
import { IEventHandlerStore } from '../i-event-handler-store'

import { ArrayHelper } from './array-helper'

export class EventHandlerStore<THandler extends Callback>
  implements IEventHandlerStore<THandler> {
  public handlers: THandler[]

  public constructor() {
    this.handlers = []
  }

  public add(handler: THandler): void {
    this.handlers.push(handler)
  }

  public remove(handler: THandler): void {
    ArrayHelper.remove(this.handlers, handler)
  }
}
