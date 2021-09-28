import { Client, UserService } from '@/flow/src';
import { User } from '@/flow/src/types';
import mocks from '../mocks';

export default class LocalUserService implements UserService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get() {
    return new Promise<User>(resolve => {
      resolve(mocks('./user.json'));
    });
  }
}
