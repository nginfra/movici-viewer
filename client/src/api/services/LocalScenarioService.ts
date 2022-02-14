import { Client } from '@movici-flow-common/api';

import { ScenarioService, UUID } from '@movici-flow-common/types';
import { GetScenario, GetScenarios } from '@/api/requests';

export default class LocalScenarioService implements ScenarioService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async get(scenario_uuid: UUID) {
    return this.client?.request(new GetScenario(scenario_uuid));
  }

  async list() {
    return this.client?.request(new GetScenarios());
  }
}
