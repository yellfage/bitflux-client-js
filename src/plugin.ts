import type { WstClient } from './wst-client'

export interface Plugin {
  initialize(client: WstClient): void
}
