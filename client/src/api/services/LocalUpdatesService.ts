import { Client, UpdatesService } from '@movici-flow-common/api';
import { ComponentProperty, UUID } from '@movici-flow-common/types';
import { GetUpdates, GetUpdateWithData } from '@/api/requests';

export default class LocalUpdatesService implements UpdatesService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(uuid: UUID, entityGroup: string, properties: ComponentProperty[]) {
    return this.client.request(new GetUpdateWithData(uuid, entityGroup, properties));
  }

  list(scenario_uuid: string) {
    return this.client.request(new GetUpdates(scenario_uuid));
  }
}
