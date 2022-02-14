import { Client } from '@movici-flow-common/api';
import { SummaryService, UUID } from '@movici-flow-common/types';
import { GetDatasetSummary, GetScenarioSummary } from '@/api/requests';

export default class LocalSummaryService implements SummaryService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getScenario(scenario_uuid: UUID, dataset_uuid: UUID) {
    return this.client?.request(new GetScenarioSummary(scenario_uuid, dataset_uuid));
  }

  getDataset(dataset_uuid: UUID) {
    return this.client?.request(new GetDatasetSummary(dataset_uuid));
  }
}
