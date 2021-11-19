import type { Transport, Protocol } from '../../communication'

import type { Agreement } from './agreement'

const ERROR_MESSAGE = 'Unable to get the property of the empty agreement'

export class EmptyAgreement implements Agreement {
  public get transport(): Transport {
    throw new Error(ERROR_MESSAGE)
  }

  public get protocol(): Protocol {
    throw new Error(ERROR_MESSAGE)
  }
}
