import Client from '@/flow/src/api/client';
import ProjectService from '@/flow/src/api/services/project';
import { Project } from '@/flow/src/types';

export default class LocalProjectService implements ProjectService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  list() {
    return new Promise<Project[]>(resolve => {
      resolve([
        {
          created_on: 1598962541,
          dataset_count: 10,
          display_name: 'Test Project',
          name: 'test_project',
          scenario_count: 2,
          uuid: '1bf3d081-16e1-4353-966e-19f8fe47b3f3'
        }
      ]);
    });
    // return await this.backend?.request(new GetProjects());
  }
}
