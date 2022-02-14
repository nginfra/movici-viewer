/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '@movici-flow-common/api';
import { User, UserService } from '@movici-flow-common/types';
import mocks, { MOCK_TIMEOUT } from './mocks';

export default class MockUserService implements UserService {
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
