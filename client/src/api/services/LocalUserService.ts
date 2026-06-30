import type { IClient, UserService } from "@nginfra/movici-flow-lib/types";

export default class DummyUserService implements UserService {
  client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  async get() {
    return await null;
  }
}
