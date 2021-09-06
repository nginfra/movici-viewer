import { Role, RoleBinding, UserCrudResponse, UUID } from '@/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { authServerBase } from '@/api/uri';
import { Request } from '@/api/requests/base';

export class GetRoles extends Request<Role[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${authServerBase}${uri.roles}`
    };
  }

  makeResponse(resp: AxiosResponse): Role[] {
    return resp.data.roles;
  }
}

export class AddUserRole extends Request<UserCrudResponse> {
  userUUID: UUID;
  userRole: RoleBinding;
  constructor(userUUID: UUID, userRole: RoleBinding) {
    super();
    this.userUUID = userUUID;
    this.userRole = userRole;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${authServerBase}${uri.users}/${this.userUUID}${uri.roles}`,
      data: this.userRole
    };
  }
}

export class DeleteUserRole extends Request<UserCrudResponse> {
  userUUID: UUID;
  userRole: RoleBinding;
  constructor(userUUID: UUID, userRole: RoleBinding) {
    super();
    this.userUUID = userUUID;
    this.userRole = userRole;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${authServerBase}${uri.users}/${this.userUUID}${uri.roles}`,
      data: this.userRole
    };
  }
}
