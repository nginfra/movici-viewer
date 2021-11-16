/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, UpdatesService } from '@movici-flow-common/api';
import { ComponentProperty, Update, UUID } from '@movici-flow-common/types';
import { MOCK_TIMEOUT } from './mocks';
export default class MockUpdatesService implements UpdatesService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(uuid: UUID, entityGroup: string, properties: ComponentProperty[]) {
    return new Promise<null>(resolve => resolve(null));
  }

  list(scenario_uuid: string) {
    return new Promise<Update[]>(resolve => {
      setTimeout(() => resolve(([] as unknown) as Update[]), MOCK_TIMEOUT);
    });
  }
}
