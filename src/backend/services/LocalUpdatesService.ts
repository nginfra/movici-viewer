import Client from '@/api/client';
import UpdatesService from '@/flow/backend/updates';
import { GetUpdates, GetUpdateWithData } from '@/flow/requests';
import { ComponentProperty, UUID } from '@/flow/types';

export default class LocalUpdatesService implements UpdatesService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get({
    uuid,
    entityGroup,
    properties
  }: {
    uuid: UUID;
    entityGroup: string;
    properties: ComponentProperty[];
  }) {
    return this.client.request(new GetUpdateWithData(uuid, entityGroup, properties));
  }

  list(scenario_uuid: string) {
    return this.client.request(new GetUpdates(scenario_uuid));
  }
}
