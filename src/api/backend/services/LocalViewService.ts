import Client from '@/flow/api/client';
import ViewService from '@/flow/api/backend/view';
import { UUID, View } from '@/flow/types';

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
    return new Promise<View[]>(resolve => resolve([]));
    // return (await client?.request(new GetViews(scenarioUUID))) ?? [];
  }

  async get(viewUUID: UUID) {
    return new Promise<View>(
      resolve =>
        viewUUID &&
        resolve({
          name: 'Local View',
          config: {
            version: 1,
            visualizers: []
          }
        })
    ); // get sample view
    // return await client?.request(new GetView(viewUUID));
  }

  async update(viewUUID: UUID, view: View) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new UpdateView(viewUUID, view));
  }

  async delete(viewUUID: UUID) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new DeleteView(viewUUID));
  }
}
