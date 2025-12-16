import { GetDatasetSummary, GetScenarioSummary } from "@/api/requests";
import type { IClient, SummaryService, UUID } from "@movici-flow-lib/types";

export default class LocalSummaryService implements SummaryService {
  client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  getScenario(scenario_uuid: UUID, dataset_uuid: UUID) {
    return this.client?.request(new GetScenarioSummary(scenario_uuid, dataset_uuid));
  }

  getDataset(dataset_uuid: UUID) {
    return this.client?.request(new GetDatasetSummary(dataset_uuid));
  }
}
