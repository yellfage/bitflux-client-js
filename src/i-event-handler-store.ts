import { Callback } from './internal/callback'

export interface IEventHandlerStore<THandler extends Callback> {
  add(handler: THandler): void
  remove(handler: THandler): void
}
