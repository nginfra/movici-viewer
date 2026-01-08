import { GetScenario, GetScenarios } from "@/api/requests";
import type { IClient, ScenarioService, UUID } from "@movici-flow-lib/types";

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
}
