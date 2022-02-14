import { Client } from '@movici-flow-common/api';
import {
  ComponentProperty,
  DatasetService,
  DatasetWithData,
  UUID
} from '@movici-flow-common/types';
import { GetDatasetData, GetDatasets, GetScenarioState } from '@/api/requests/datasets';

type getDataParams = {
  datasetUUID: UUID;
  entityGroup?: string;
  properties?: ComponentProperty[];
};

type getStateParams = {
  datasetUUID: UUID;
  scenarioUUID: UUID;
  entityGroup: string;
  timestamp: number;
  properties: ComponentProperty[];
};
export default class LocalDatasetService implements DatasetService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async list() {
    return (await this.client?.request(new GetDatasets())) ?? [];
  }

  async getData<T>(params: getDataParams): Promise<DatasetWithData<T> | null> {
    const { datasetUUID, entityGroup, properties } = params;
    return await this.client.request(new GetDatasetData<T>(datasetUUID, entityGroup, properties));
  }

  async getState<T>(params: getStateParams): Promise<DatasetWithData<T> | null> {
    const { datasetUUID, scenarioUUID, entityGroup, properties, timestamp } = params;

    return await this.client.request(
      new GetScenarioState(datasetUUID, scenarioUUID, entityGroup, properties, timestamp)
    );
  }
}
