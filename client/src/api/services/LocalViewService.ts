import {
  AddView,
  Client,
  DeleteView,
  GetView,
  GetViews,
  UpdateView,
  ViewService
} from '@movici-flow-common/api';
import { UUID, View } from '@movici-flow-common/types';

export default class LocalViewService implements ViewService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async create(scenarioUUID: UUID, view: View) {
    return await this.client.request(new AddView(scenarioUUID, view));
  }

  async list(scenarioUUID: UUID) {
    return await this.client.request(new GetViews(scenarioUUID));
  }

  async get(viewUUID: UUID) {
    return await this.client.request(new GetView(viewUUID));
  }

  async update(viewUUID: UUID, view: View) {
    return await this.client.request(new UpdateView(viewUUID, view));
  }

  async delete(viewUUID: UUID) {
    return await this.client.request(new DeleteView(viewUUID));
  }
}
