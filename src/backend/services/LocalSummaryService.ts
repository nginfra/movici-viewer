import Client from '@/api/client';
import SummaryService from '@/flow/backend/summary';
import { DatasetSummary, UUID } from '@/flow/types';

export default class LocalSummaryService implements SummaryService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(dataset_uuid: UUID) {
    return new Promise<DatasetSummary | null>(resolve => resolve(null));
  }
}
