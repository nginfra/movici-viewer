import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Organisation } from '@/types';
import Client from '@/api/client';
import {
  AddOrganisation,
  DeleteOrganisation,
  GetOrganisation,
  GetOrganisations,
  UpdateOrganisation
} from '@/api/requests';

@Module
export default class OrganisationStore extends VuexModule {
  organisations: Organisation[] = [];
  organisation: Organisation | Record<string, unknown> = {};

  @Mutation
  SET_ORGANISATIONS(organisations: Organisation[]) {
    this.organisations = organisations;
  }

  @Mutation
  SET_ORGANISATION(organisation: Organisation) {
    this.organisation = organisation;
  }

  @Action({ rawError: true, commit: 'SET_ORGANISATIONS' })
  async getOrganisations() {
    const api: Client = this.context.getters.api;
    return await api.request(new GetOrganisations());
  }

  @Action({ rawError: true, commit: 'SET_ORGANISATION' })
  async getOrganisation(uuid: string) {
    const api: Client = this.context.getters.api;
    return await api.request(new GetOrganisation(uuid));
  }

  @Action({ rawError: true })
  async updateOrganisation(organisation: Partial<Organisation>) {
    const api: Client = this.context.getters.api;
    if (organisation.organisation_uuid) {
      const uuid = organisation.organisation_uuid;
      delete organisation.organisation_uuid;
      return await api.request(new UpdateOrganisation(uuid, organisation));
    }
    throw new Error('Cannot determine organisation_uuid');
  }

  @Action({ rawError: true })
  async addOrganisation(organisation: Organisation) {
    const api: Client = this.context.getters.api;
    return await api.request(new AddOrganisation(organisation));
  }

  @Action({ rawError: true })
  async deleteOrganisation(payload: { organisation_uuid: string }) {
    const api: Client = this.context.getters.api;
    return await api.request(new DeleteOrganisation(payload.organisation_uuid));
  }

  @Action({ rawError: true, commit: 'SET_ORGANISATION' })
  clearOrganisation() {
    return {};
  }
}
