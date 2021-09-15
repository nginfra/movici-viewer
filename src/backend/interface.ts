import { Dataset, DatasetSummary, Project, UUID, View } from '@/flow/types';
import { User } from '@/types';

// WIP: create interfaces for all FlowStore related requests

export interface ViewService {
  create({ scenarioUUID, view }: { scenarioUUID: UUID; view: View }): Promise<UUID>;
  list(scenarioUUID: UUID): Promise<View[]>;
  get(viewUUID: UUID): Promise<View>;
  update({ viewUUID, view }: { viewUUID: UUID; view: View }): Promise<void>;
  delete(viewUUID: UUID): Promise<void>;
}

export default interface Backend {
  getCapabilities(): string[];
  getUser(): User | null;
  getProjects(): Project[]; // directs the path to get projects (in remote), or a empty array (in local)
  getDatasets(project_uuid?: UUID): Dataset[];
  getSummary(dataset_uuid: UUID): DatasetSummary | null;
  // views
  view: ViewService;
}
