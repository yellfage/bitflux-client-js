import type { Protocol, Transport } from '../../communication'

import type { Agreement } from './agreement'

type Version = { major: number; minor: number }

type AgreementResponse = {
  version: Version
  transportNames: string[]
  protocolNames: string[]
}

export class Negotiator {
  private readonly url: URL

  private readonly transports: Transport[]

  private readonly protocols: Protocol[]

  private readonly version: Version = { major: 1, minor: 0 }

  public constructor(url: URL, transports: Transport[], protocols: Protocol[]) {
    this.url = url
    this.transports = transports
    this.protocols = protocols
  }

  public async negotiate(): Promise<Agreement> {
    const { origin, pathname } = this.url

    const path = pathname.replace(/\/$/, '')

    const response = await fetch(`${origin}${path}/agreement`)

    if (response.status !== 200) {
      throw new Error(
        'Unable to negotiate communication: the server has responded ' +
          `with the "${response.status}(${response.statusText})" status`
      )
    }

    const { version, transportNames, protocolNames } =
      (await response.json()) as AgreementResponse

    if (
      version.major !== this.version.major ||
      version.minor < this.version.minor
    ) {
      throw new Error(
        'Unable to negotiate communication: the server version ' +
          'is incompatable with the client version. ' +
          `Client version: ${this.version.major}.${this.version.minor}. ` +
          `Server version: ${version.major}.${version.minor}`
      )
    }

    return {
      transport: this.selectTransport(transportNames),
      protocol: this.selectProtocol(protocolNames)
    }
  }

  private resolveSurveyedTransports(): Transport[] {
    return this.transports.filter((transport) => transport.survey())
  }

  private selectTransport(names: string[]): Transport {
    const transports = this.resolveSurveyedTransports()

    if (!transports.length) {
      throw new Error(
        'Unable to select a transport: the provided transports ' +
          'are not supported in the current environment'
      )
    }

    const transport = transports.find(({ name }) => names.includes(name))

    if (!transport) {
      throw new Error(
        `Unable to select a transport: the provided transports are not supported on the server side`
      )
    }

    return transport
  }

  private selectProtocol(names: string[]): Protocol {
    const protocol = this.protocols.find(({ name }) => names.includes(name))

    if (!protocol) {
      throw new Error(
        `Unable to select a protocol: the provided protocols are not supported on the server side`
      )
    }

    return protocol
  }
}
