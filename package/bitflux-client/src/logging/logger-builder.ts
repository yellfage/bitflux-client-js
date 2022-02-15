import type { Logger } from './logger'

export interface LoggerBuilder {
  build(): Logger
  clone(): LoggerBuilder
}
