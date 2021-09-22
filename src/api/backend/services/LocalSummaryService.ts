import Client from '@/flow/api/client';
import SummaryService from '@/flow/api/backend/summary';
import { GetDatasetSummary, GetScenarioSummary } from '@/flow/requests';
import { UUID } from '@/flow/types';

export default class LocalSummaryService implements SummaryService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getScenario(scenario_uuid: UUID, dataset_uuid: UUID) {
    return this.client.request(new GetScenarioSummary(scenario_uuid, dataset_uuid));
    // return new Promise<DatasetSummary | null>(resolve => resolve(null));
  }

  getDataset(dataset_uuid: UUID) {
    return this.client.request(new GetDatasetSummary(dataset_uuid));
  }
}
