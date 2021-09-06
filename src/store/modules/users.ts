import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { RoleBinding, User } from '@/types';
import Client from '@/api/client';
import {
  AddUser,
  AddUserRole,
  DeleteUser,
  DeleteUserRole,
  GetUser,
  GetUsers,
  InviteUser,
  UpdateUser
} from '@/api/requests';

@Module
export default class UserStore extends VuexModule {
  users: User[] = [];
  user: User | Record<string, unknown> = {};

  @Mutation
  SET_USERS(users: User[]) {
    this.users = users;
  }

  @Mutation
  SET_USER(user: User) {
    this.user = user;
  }
  @Action({ rawError: true, commit: 'SET_USERS' })
  async getUsers() {
    const api: Client = this.context.getters.api;
    return await api.request(new GetUsers());
  }

  @Action({ rawError: true, commit: 'SET_USER' })
  async getUser(uuid: string) {
    const api: Client = this.context.getters.api;
    return await api.request(new GetUser(uuid));
  }

  @Action({ rawError: true })
  async updateUser(user: User) {
    const api: Client = this.context.getters.api;
    const uuid = user.user_uuid;
    if (!uuid) {
      throw new Error('Cannot determine uuid for user');
    }
    return await api.request(new UpdateUser(uuid, user));
  }

  @Action({ rawError: true })
  async addUser(user: Partial<User>) {
    const api: Client = this.context.getters.api;
    return await api.request(new AddUser(user));
  }

  @Action({ rawError: true })
  async deleteUser(user: User) {
    const api: Client = this.context.getters.api;
    if (!user.user_uuid) {
      throw new Error('Cannot determine uuid for user');
    }
    return await api.request(new DeleteUser(user.user_uuid));
  }

  @Action({ rawError: true })
  async addUserRole(payload: { uuid: string; userRole: RoleBinding }) {
    const api: Client = this.context.getters.api;
    const uuid = payload.uuid;
    return await api.request(new AddUserRole(uuid, payload.userRole));
  }

  @Action({ rawError: true })
  async deleteUserRole(payload: { uuid: string; userRole: RoleBinding }) {
    const api: Client = this.context.getters.api;

    const uuid = payload.uuid;
    return await api.request(new DeleteUserRole(uuid, payload.userRole));
  }

  @Action({ rawError: true, commit: 'SET_USER' })
  clearUser() {
    return {};
  }

  @Action({ rawError: true })
  async inviteUser(user: { uuid: string }) {
    const api: Client = this.context.getters.api;
    return await api.request(new InviteUser(user.uuid));
  }
}
