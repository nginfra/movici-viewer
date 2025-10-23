import { GetScenario, GetScenarios, UpdateScenario } from '@/api/requests';
import type { IClient, Scenario, ScenarioService, UUID } from '@movici-flow-lib/types';

export default class LocalScenarioService implements ScenarioService {
  client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  async get(scenario_uuid: UUID) {
    return this.client?.request(new GetScenario(scenario_uuid));
  }

  async list() {
    return this.client?.request(new GetScenarios());
  }

  async update(scenario_uuid: UUID, config: Scenario) {
    return this.client?.request(new UpdateScenario(scenario_uuid, config));
  }
}
