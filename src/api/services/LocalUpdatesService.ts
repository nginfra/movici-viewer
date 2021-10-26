import { Client, UpdatesService } from '~flow/api';
import { GetUpdateWithData } from '~flow/api/requests';
import { ComponentProperty, Update, UUID } from '~flow/types';
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
