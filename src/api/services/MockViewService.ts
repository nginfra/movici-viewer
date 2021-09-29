/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, ViewService } from '@/flow/src';
import { UUID, View } from '@/flow/src/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class MockViewService implements ViewService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async create(scenarioUUID: UUID, view: View) {
    return { view_uuid: '1234' };
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

  async update(viewUUID: UUID, view: View) {
    return new Promise<void>(resolve => resolve());
  }

  async delete(viewUUID: UUID) {
    return new Promise<void>(resolve => resolve());
  }
}
