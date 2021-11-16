import { Scenario, ShortScenario, UUID } from '@movici-flow-common/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri from '@movici-flow-common/api/requests//uri';
import { Request } from '@movici-flow-common/api/requests//base';

export class GetScenarios extends Request<ShortScenario[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}`
    };
  }

  makeResponse(resp: AxiosResponse): ShortScenario[] {
    return resp.data.scenarios;
  }
}

export class GetScenario extends Request<Scenario> {
  scenarioUUID: UUID;

  constructor(scenarioUUID: UUID) {
    super();
    this.scenarioUUID = scenarioUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}/${this.scenarioUUID}`
    };
  }

  makeResponse(resp: AxiosResponse): Scenario {
    const data = resp.data;

    return (data as unknown) as Scenario;
  }
}
