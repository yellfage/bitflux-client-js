export interface ReconnectionControl {
  confirm(attempts: number): boolean
}
