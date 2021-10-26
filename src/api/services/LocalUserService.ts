import { Client, UserService } from '~flow/api';
import { User } from '~flow/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class LocalUserService implements UserService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get() {
    return new Promise<User>(resolve => {
      setTimeout(() => resolve(mocks('./user.json')), MOCK_TIMEOUT);
    });
  }
}
