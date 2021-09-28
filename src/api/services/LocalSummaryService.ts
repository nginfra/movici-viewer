import { Client, SummaryService } from '@/flow/src';
import { GetDatasetSummary, GetScenarioSummary } from '@/flow/src/api/requests';
import { DatasetSummary, UUID } from '@/flow/src/types';
import mocks from '../mocks';

export default class LocalSummaryService implements SummaryService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getScenario(scenario_uuid: UUID, dataset_uuid: UUID) {
    // return this.client.request(new GetScenarioSummary(scenario_uuid, dataset_uuid));
    return new Promise<DatasetSummary | null>(resolve => {
      resolve(mocks('./scenario_summary.json'));
    });
  }

  getDataset(dataset_uuid: UUID) {
    // return this.client.request(new GetDatasetSummary(dataset_uuid));
    return new Promise<DatasetSummary>(resolve => {
      resolve(mocks('./dataset_summary.json'));
    });
  }
}
