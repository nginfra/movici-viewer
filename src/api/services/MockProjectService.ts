/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, ProjectService } from '@/flow/src';
import { Project } from '@/flow/src/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class MockProjectService implements ProjectService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  list() {
    return new Promise<Project[]>(resolve => {
      setTimeout(() => {
        resolve((mocks('./projects.json') as unknown) as Project[]);
      }, MOCK_TIMEOUT);
    });
  }
}
