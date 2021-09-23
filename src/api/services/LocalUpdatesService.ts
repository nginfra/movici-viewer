import Client from '@/flow/api/client';
import UpdatesService from '@/flow/api/services/updates';
import { GetUpdates, GetUpdateWithData } from '@/flow/api/requests';
import { ComponentProperty, Update, UUID } from '@/flow/types';
export default class LocalUpdatesService implements UpdatesService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(uuid: UUID, entityGroup: string, properties: ComponentProperty[]) {
    return this.client.request(new GetUpdateWithData(uuid, entityGroup, properties));
  }

  list(scenario_uuid: string) {
    // return this.client.request(new GetUpdates(scenario_uuid));
    return new Promise<Update[]>(resolve => resolve(([] as unknown) as Update[]));
  }
}
