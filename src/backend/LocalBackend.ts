import { Dataset, DatasetSummary, Project, UUID, View } from '@/flow/types';
import { User } from '@/types';
import Backend, { ViewService } from './interface';

export default class LocalBackend implements Backend {
  view: LocalViewService;

  constructor() {
    this.view = new LocalViewService();
  }
  getCapabilities(): string[] {
    return [];
  }

  getUser(): User | null {
    return null;
  }

  // directs the path to get projects (in remote), or a empty array (in local)
  getProjects(): Project[] {
    return [];
  }

  getDatasets(project_uuid?: UUID): Dataset[] {
    return [];
  }

  getSummary(dataset_uuid: UUID): DatasetSummary {
    return {
      count: 0,
      entity_groups: []
    };
  }
}

class LocalViewService implements ViewService {
  async create({ scenarioUUID, view }: { scenarioUUID: UUID; view: View }) {
    return '1234';
  }

  async list(scenarioUUID: UUID): Promise<View[]> {
    return [
      // get sample views
    ];
    // return (await this.client?.request(new GetViews(scenarioUUID))) ?? [];
  }

  async get(viewUUID: UUID) {
    return {
      name: 'Local View',
      config: {
        version: 1,
        visualizers: []
      }
    }; // get sample view
    // return await this.client?.request(new GetView(viewUUID));
  }

  async update({ viewUUID, view }: { viewUUID: UUID; view: View }) {
    return;
    // return await this.client?.request(new UpdateView(viewUUID, view));
  }

  async delete(viewUUID: UUID) {
    return;
    // return await this.client?.request(new DeleteView(viewUUID));
  }
}
