import Client from '@/flow/src/api/client';
import UpdatesService from '@/flow/src/api/services/updates';
import { GetUpdates, GetUpdateWithData } from '@/flow/src/api/requests';
import { ComponentProperty, Update, UUID } from '@/flow/src/types';
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
