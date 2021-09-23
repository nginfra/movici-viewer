import Client from '@/flow/api/client';
import UserService from '@/flow/api/services/user';
import { User } from '@/types';

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
