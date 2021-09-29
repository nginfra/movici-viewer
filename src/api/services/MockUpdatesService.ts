import { Client, UpdatesService } from '@/flow/src';
import { GetUpdates, GetUpdateWithData } from '@/flow/src/api/requests';
import { ComponentProperty, Update, UUID } from '@/flow/src/types';
import { MOCK_TIMEOUT } from '../mocks';
export default class MockUpdatesService implements UpdatesService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(uuid: UUID, entityGroup: string, properties: ComponentProperty[]) {
    return this.client.request(new GetUpdateWithData(uuid, entityGroup, properties));
  }

  list(scenario_uuid: string) {
    // return this.client.request(new GetUpdates(scenario_uuid));
    return new Promise<Update[]>(resolve => {
      setTimeout(() => resolve(([] as unknown) as Update[]), MOCK_TIMEOUT);
    });
  }
}
