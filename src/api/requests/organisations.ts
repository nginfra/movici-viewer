import { Organisation, OrganisationCrudResponse, UUID } from '@/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { authServerBase } from '@/api/uri';
import { Request } from '@/api/requests/base';

export class GetOrganisations extends Request<Organisation[]> {
  constructor() {
    super();
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${authServerBase}${uri.organisations}`
    };
  }

  makeResponse(resp: AxiosResponse): Organisation[] {
    return resp.data.organisations as Organisation[];
  }
}

export class GetOrganisation extends Request<Organisation> {
  organisationUUID: UUID;

  constructor(organisationUUID: UUID) {
    super();
    this.organisationUUID = organisationUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${authServerBase}${uri.organisations}/${this.organisationUUID}`
    };
  }
}

export class AddOrganisation extends Request<OrganisationCrudResponse> {
  payload: Partial<Organisation>;
  constructor(payload: Partial<Organisation>) {
    super();
    this.payload = payload;
  }

  makeRequest(): AxiosRequestConfig {
    delete this.payload.organisation_uuid;
    return {
      method: 'post',
      url: `${authServerBase}${uri.organisations}`,
      data: this.payload
    };
  }
}

export class UpdateOrganisation extends Request<OrganisationCrudResponse> {
  payload: Partial<Organisation>;
  organisationUUID: UUID;
  constructor(organisationUUID: UUID, payload: Partial<Organisation>) {
    super();
    this.payload = payload;
    this.organisationUUID = organisationUUID;
  }

  makeRequest(): AxiosRequestConfig {
    delete this.payload.organisation_uuid;

    return {
      method: 'put',
      url: `${authServerBase}${uri.organisations}/${this.organisationUUID}`,
      data: this.payload
    };
  }
}

export class DeleteOrganisation extends Request<OrganisationCrudResponse> {
  organisationUUID: UUID;
  constructor(organisationUUID: UUID) {
    super();
    this.organisationUUID = organisationUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${authServerBase}${uri.organisations}/${this.organisationUUID}`
    };
  }
}
