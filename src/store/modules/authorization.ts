import { Role, Scope } from '@/types';
import { AddScope, DeleteScope, GetRoles, GetScopes } from '@/api/requests';
import { handleFailedRequest } from '@/store/requests';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module
export default class AuthorizationStore extends VuexModule {
  rawScopes: Scope[] = [];
  scopesMap: Record<string, string[]> = {};
  roles: Role[] = [];

  @Mutation
  setScopes(rawScopes: Scope[]) {
    this.rawScopes = rawScopes;
    const scopesMap: Record<string, string[]> = {};
    rawScopes.forEach(scope => {
      const [type, name] = scope.scope_name.split(':');
      if (!Object.prototype.hasOwnProperty.call(scopesMap, type)) {
        scopesMap[type] = [];
      }
      scopesMap[type].push(name);
    });
    for (const scopeType in scopesMap) {
      if (Object.prototype.hasOwnProperty.call(scopesMap, scopeType)) {
        scopesMap[scopeType].sort();
      }
    }
    this.scopesMap = scopesMap;
  }
  @Mutation
  setRoles(roles: Role[]) {
    this.roles = roles;
  }

  @Action({ rawError: true, commit: 'setScopes' })
  async getScopes() {
    try {
      return await this.context.getters.api.request(new GetScopes());
    } catch (e) {
      await handleFailedRequest(e);
    }
  }
  @Action({ rawError: true })
  async addScope(scope: Scope) {
    try {
      return await this.context.getters.api.request(new AddScope(scope.scope_name));
    } catch (e) {
      await handleFailedRequest(e);
    }
  }
  @Action({ rawError: true })
  async deleteScope(scope: Scope) {
    const uuid = scope.scope_uuid;
    try {
      return await this.context.getters.api.request(new DeleteScope(uuid));
    } catch (e) {
      return await handleFailedRequest(e);
    }
  }
  @Action({ rawError: true, commit: 'setRoles' })
  async getRoles() {
    return await this.context.getters.api.request(new GetRoles());
  }
}
