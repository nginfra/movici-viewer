import { Client, GetProjects, ProjectService } from '@/flow/src';
import { Project } from '@/flow/src/types';
import mocks from '../mocks';

export default class LocalProjectService implements ProjectService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  list() {
    return new Promise<Project[]>(resolve => {
      resolve(mocks('./projects.json'));
      // return this.client?.request(new GetProjects());
    });
  }
}
