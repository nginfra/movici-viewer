import { Client, ViewService } from '@movici-flow-common/api';
import { UUID, View, ViewCrudResponse } from '@movici-flow-common/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class LocalViewService implements ViewService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async create(scenarioUUID: UUID, view: View) {
    return new Promise<ViewCrudResponse>(resolve =>
      resolve({
        view_uuid: '1234'
      } as ViewCrudResponse)
    );
  }

  async list(scenarioUUID: UUID): Promise<View[]> {
    return new Promise<View[]>(resolve => {
      setTimeout(() => resolve((mocks('./views.json') as unknown) as View[]), MOCK_TIMEOUT);
    });
  }

  async get(viewUUID: UUID) {
    return new Promise<View>(resolve => {
      setTimeout(() => resolve(mocks('./views.json')[0]), MOCK_TIMEOUT);
    });
  }

  // for local we can setup save files for views
  async update(viewUUID: UUID, view: View) {
    return new Promise<ViewCrudResponse>(resolve =>
      resolve({
        view_uuid: viewUUID
      } as ViewCrudResponse)
    );
  }

  async delete(viewUUID: UUID) {
    return new Promise<ViewCrudResponse>(resolve =>
      resolve({
        view_uuid: viewUUID
      } as ViewCrudResponse)
    );
  }
}
