import { Client, UserService } from '@/flow/src';
import { User } from '@/flow/src/types';
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