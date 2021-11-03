import { Client, UserService } from '@movici-flow-common/api';

export default class DummyUserService implements UserService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async get() {
    return await null;
  }
}
