import { DatasetSummary, UUID } from '@/flow/types';

export default interface SummaryService {
  get(dataset_uuid: UUID): Promise<DatasetSummary | null>;
}
