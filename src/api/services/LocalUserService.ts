import Client from '@/flow/src/api/client';
import UserService from '@/flow/src/api/services/user';
import { User } from '@/flow/src/types';

export default class LocalUserService implements UserService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get() {
    return new Promise<User>(resolve => {
      resolve({
        firstname: 'Movici',
        middlename: null,
        lastname: 'Local User',
        active: true,
        language: 'en',
        created_on: 0,
        organisation: '',
        organisation_uuid: '',
        username: 'movici_local_user',
        roles: []
      });
    });
  }
}
