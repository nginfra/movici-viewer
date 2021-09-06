import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Scope, ScopeCrudResponse, UUID } from '@/types';
import uri, { authServerBase } from '@/api/uri';
import { Request } from '@/api/requests/base';

export class GetScopes extends Request<Scope[]> {
  makeResponse(resp: AxiosResponse): Scope[] {
    return resp.data.scopes;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${authServerBase}${uri.scopes}`
    };
  }
}

export class AddScope extends Request<ScopeCrudResponse> {
  scope_name: string;
  constructor(scope_name: string) {
    super();
    this.scope_name = scope_name;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${authServerBase}${uri.scopes}`,
      data: {
        scope_name: this.scope_name
      }
    };
  }
}

export class DeleteScope extends Request<ScopeCrudResponse> {
  scopeUUID: UUID;
  constructor(scopeUUID: UUID) {
    super();
    this.scopeUUID = scopeUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${authServerBase}${uri.scopes}/${this.scopeUUID}`
    };
  }
}
