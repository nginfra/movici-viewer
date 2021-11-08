import { Client, SummaryService } from '@movici-flow-common/api';
import { DatasetSummary, UUID } from '@movici-flow-common/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class LocalSummaryService implements SummaryService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getScenario(scenario_uuid: UUID, dataset_uuid: UUID) {
    return new Promise<DatasetSummary | null>(resolve => {
      setTimeout(() => resolve(mocks('./scenario_summary.json')), MOCK_TIMEOUT);
    });
  }

  getDataset(dataset_uuid: UUID) {
    return new Promise<DatasetSummary>(resolve => {
      setTimeout(() => resolve(mocks('./dataset_summary.json')), MOCK_TIMEOUT);
    });
  }
}
