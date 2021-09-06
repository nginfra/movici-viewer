import { CrudResponse, User, UserCrudResponse, UUID } from '@/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { authServerBase } from '@/api/uri';
import { Request } from '@/api/requests/base';

export class GetUsers extends Request<User[]> {
  constructor() {
    super();
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${authServerBase}${uri.users}`
    };
  }

  makeResponse(resp: AxiosResponse): User[] {
    return resp.data.users;
  }
}

export class GetUser extends Request<User> {
  userUUID: UUID;

  constructor(userUUID: UUID) {
    super();
    this.userUUID = userUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${authServerBase}${uri.users}/${this.userUUID}`
    };
  }
}

export class AddUser extends Request<UserCrudResponse> {
  payload: Partial<User>;
  constructor(payload: Partial<User>) {
    super();
    this.payload = payload;
  }

  makeRequest(): AxiosRequestConfig {
    delete this.payload.user_uuid;
    return {
      method: 'post',
      url: `${authServerBase}${uri.users}`,
      data: this.payload
    };
  }
}

export class UpdateUser extends Request<UserCrudResponse> {
  payload: Partial<User>;
  userUUID: UUID;
  constructor(userUUID: UUID, payload: Partial<User>) {
    super();
    this.payload = payload;
    this.userUUID = userUUID;
  }

  makeRequest(): AxiosRequestConfig {
    delete this.payload.user_uuid;

    return {
      method: 'put',
      url: `${authServerBase}${uri.users}/${this.userUUID}`,
      data: this.payload
    };
  }
}

export class DeleteUser extends Request<UserCrudResponse> {
  userUUID: UUID;
  constructor(userUUID: UUID) {
    super();
    this.userUUID = userUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${authServerBase}${uri.users}/${this.userUUID}`
    };
  }
}

export class InviteUser extends Request<CrudResponse> {
  userUUID: UUID;
  constructor(userUUID: UUID) {
    super();
    this.userUUID = userUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${authServerBase}${uri.users}/${this.userUUID}${uri.invite}`
    };
  }
}
