import Client from '@/flow/api/client';
import DatasetService from '@/flow/api/backend/dataset';
import { GetDatasetData, GetScenarioState } from '@/flow/requests';
import { ComponentProperty, Dataset, DatasetWithData, UUID } from '@/flow/types';

export default class LocalDatasetService implements DatasetService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async list(project_uuid: string) {
    return new Promise<Dataset[]>(resolve => {
      resolve([]);
    });
    // return (await this.client?.request(new GetDatasets(project_uuid))) ?? [];
  }

  async getData<T>(params: {
    datasetUUID: UUID;
    entityGroup?: string;
    properties?: ComponentProperty[];
  }): Promise<DatasetWithData<T> | null> {
    const { datasetUUID, entityGroup, properties } = params;

    return await this.client.request(new GetDatasetData<T>(datasetUUID, entityGroup, properties));
  }

  async getState<T>(params: {
    datasetUUID: UUID;
    scenarioUUID: UUID;
    entityGroup: string;
    properties: ComponentProperty[];
    timestamp: number;
  }): Promise<DatasetWithData<T> | null> {
    const { datasetUUID, scenarioUUID, entityGroup, properties, timestamp } = params;

    return await this.client.request(
      new GetScenarioState(datasetUUID, scenarioUUID, entityGroup, properties, timestamp)
    );
  }
}
