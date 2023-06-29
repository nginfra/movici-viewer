import { GetUpdates, GetUpdateWithData } from '@/api/requests';
import type { IClient } from '@movici-flow-lib/types';
import type { DataAttribute, UpdatesService, UUID } from '@movici-flow-lib/types';

export default class LocalUpdatesService implements UpdatesService {
  client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  get(uuid: UUID, entityGroup: string, properties: DataAttribute[]) {
    return this.client.request(new GetUpdateWithData(uuid, entityGroup, properties));
  }

  list(scenario_uuid: string) {
    return this.client.request(new GetUpdates(scenario_uuid));
  }
}
