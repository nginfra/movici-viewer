import { Client, ScenarioService } from '@/flow/src';

import { Scenario, ShortScenario, SimulationMode, UUID } from '@/flow/src/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class LocalScenarioService implements ScenarioService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(scenario_uuid: UUID) {
    return new Promise<Scenario>(resolve => {
      resolve((mocks('./scenario.json') as unknown) as Scenario);
    });
    // return await client?.request(new GetScenario(scenario_uuid));
  }

  list(project_uuid: UUID) {
    return new Promise<ShortScenario[]>(resolve => {
      setTimeout(() => resolve(mocks('./scenarios.json')), MOCK_TIMEOUT);
    });
    // return (await client?.request(new GetScenarios(project_uuid))) ?? []
  }
}