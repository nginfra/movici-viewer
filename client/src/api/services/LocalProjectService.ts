import { Client, ProjectService } from '@movici-flow-common/api';

export default class DummyProjectService implements ProjectService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async list() {
    return await null;
  }
}
