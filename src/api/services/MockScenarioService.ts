/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, ScenarioService } from '@/flow/src';
import { Scenario, ShortScenario, UUID } from '@/flow/src/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';
export default class MockScenarioService implements ScenarioService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(scenario_uuid: UUID) {
    return new Promise<Scenario>(resolve => {
      resolve((mocks('./scenario.json') as unknown) as Scenario);
    });
  }

  list(project_uuid: UUID) {
    return new Promise<ShortScenario[]>(resolve => {
      setTimeout(() => resolve(mocks('./scenarios.json')), MOCK_TIMEOUT);
    });
  }
}
