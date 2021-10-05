/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, SummaryService } from '@/flow/src';
import { DatasetSummary, UUID } from '@/flow/src/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class MockSummaryService implements SummaryService {
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
