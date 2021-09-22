import Client from '@/flow/api/client';
import ProjectService from '@/flow/api/backend/project';
import { Project } from '@/flow/types';

export default class LocalProjectService implements ProjectService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  list() {
    return new Promise<Project[]>(resolve => {
      resolve([
        {
          uuid: 'local_project',
          name: 'local_project',
          display_name: 'local_project',
          scenario_count: 0,
          dataset_count: 0
        }
      ]);
    });
    // return await this.backend?.request(new GetProjects());
  }
}
