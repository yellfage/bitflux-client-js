import type { ReconnectionControl } from './reconnection-control'

export interface ReconnectionControlBuilder {
  build(): ReconnectionControl
  clone(): ReconnectionControlBuilder
}
