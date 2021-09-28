import { Client, ViewService } from '@/flow/src';
import { UUID, View } from '@/flow/src/types';
import mocks, { MOCK_TIMEOUT } from '../mocks';

export default class LocalViewService implements ViewService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async create(scenarioUUID: UUID, view: View) {
    return { view_uuid: '1234' };
  }

  async list(scenarioUUID: UUID): Promise<View[]> {
    // get sample views
    return new Promise<View[]>(resolve => {
      setTimeout(() => resolve((mocks('./views.json') as unknown) as View[]), MOCK_TIMEOUT);
    });
    // return (await client?.request(new GetViews(scenarioUUID))) ?? [];
  }

  async get(viewUUID: UUID) {
    return new Promise<View>(resolve => {
      setTimeout(() => resolve(mocks('./views.json')[0]), MOCK_TIMEOUT);
    }); // get sample view
    // return await client?.request(new GetView(viewUUID));
  }

  // for local we can setup save files for views
  async update(viewUUID: UUID, view: View) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new UpdateView(viewUUID, view));
  }

  async delete(viewUUID: UUID) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new DeleteView(viewUUID));
  }
}
