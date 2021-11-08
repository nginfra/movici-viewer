import { Client, UpdatesService } from '@movici-flow-common/api';
import { GetUpdateWithData } from '@movici-flow-common/api/requests';
import { ComponentProperty, Update, UUID } from '@movici-flow-common/types';
import { MOCK_TIMEOUT } from '../mocks';
export default class LocalUpdatesService implements UpdatesService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(uuid: UUID, entityGroup: string, properties: ComponentProperty[]) {
    return this.client.request(new GetUpdateWithData(uuid, entityGroup, properties));
  }

  list(scenario_uuid: string) {
    return new Promise<Update[]>(resolve => {
      setTimeout(() => resolve(([] as unknown) as Update[]), MOCK_TIMEOUT);
    });
  }
}
