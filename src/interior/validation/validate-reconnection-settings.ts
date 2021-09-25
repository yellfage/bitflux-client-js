import type { ReconnectionSettings } from '../../configuration'

export function validateReconnectionSettings({
  scheme
}: ReconnectionSettings): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (scheme == null) {
    throw new TypeError(
      'Invalid reconnection settings: the "scheme" field cannot be a null or undefined'
    )
  }
}
