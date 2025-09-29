import type { Scenario, ShortScenario, UUID } from '@movici-flow-lib/types'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import uri from './uri'
import { Request } from '@movici-flow-lib/api/requests//base'

export class GetScenarios extends Request<ShortScenario[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}`
    }
  }

  makeResponse(resp: AxiosResponse): ShortScenario[] {
    return resp.data.scenarios
  }
}

export class GetScenario extends Request<Scenario> {
  scenarioUUID: UUID

  constructor(scenarioUUID: UUID) {
    super()
    this.scenarioUUID = scenarioUUID
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}/${this.scenarioUUID}`
    }
  }

  makeResponse(resp: AxiosResponse): Scenario {
    const data = resp.data

    return data as unknown as Scenario
  }
}

export class UpdateScenarioConfig extends Request<{result: string; message: string}> {
  scenarioUUID: UUID
  config: string

  constructor(scenarioUUID: UUID, config: string) {
    super()
    this.scenarioUUID = scenarioUUID
    this.config = config
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: `${uri.scenarios}/${this.scenarioUUID}/config`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        config: this.config
      }
    }
  }

  makeResponse(resp: AxiosResponse): {result: string; message: string} {
    return resp.data
  }
}
