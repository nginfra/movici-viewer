/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '@movici-flow-common/api';
import { UUID, View, ViewCrudResponse , ViewService} from '@movici-flow-common/types';
import mocks, { MOCK_TIMEOUT } from './mocks';

export default class MockViewService implements ViewService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async create(scenarioUUID: UUID, view: View) {
    return new Promise<ViewCrudResponse | null>(resolve => {
      setTimeout(() => resolve({ view_uuid: '1234' } as ViewCrudResponse), MOCK_TIMEOUT);
    });
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

  async update(viewUUID: UUID, view: View): Promise<ViewCrudResponse | null> {
    return new Promise<ViewCrudResponse | null>(resolve => {
      setTimeout(() => resolve({ view_uuid: '1234' } as ViewCrudResponse), MOCK_TIMEOUT);
    });
  }

  async delete(viewUUID: UUID) {
    return new Promise<ViewCrudResponse | null>(resolve => {
      setTimeout(() => resolve({ view_uuid: '1234' } as ViewCrudResponse), MOCK_TIMEOUT);
    });
  }
}
