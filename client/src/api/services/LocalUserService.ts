import { Client } from '@movici-flow-common/api';
import { UserService } from '@movici-flow-common/types';

export default class DummyUserService implements UserService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async get() {
    return await null;
  }
}
