import { Client, GetProjects, ProjectService } from 'flow/api';
import { Project } from 'flow/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class LocalProjectService implements ProjectService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  list() {
    return new Promise<Project[]>(resolve => {
      setTimeout(() => {
        resolve((mocks('./projects.json') as unknown) as Project[]);
      }, MOCK_TIMEOUT);
      // return this.client?.request(new GetProjects());
    });
  }
}
