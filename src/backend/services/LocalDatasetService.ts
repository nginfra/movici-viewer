import Client from '@/api/client';
import DatasetService from '@/flow/backend/dataset';
import { GetDatasetData, GetScenarioState } from '@/flow/requests';
import { ComponentProperty, Dataset, DatasetWithData, UUID } from '@/flow/types';

export default class LocalDatasetService implements DatasetService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  list(project_uuid?: UUID) {
    // get sample views
    return new Promise<Dataset[]>(resolve => resolve([]));
    // return (await client?.request(new GetViews(scenarioUUID))) ?? [];
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
    const response = await this.client.request(
      new GetScenarioState(
        params.datasetUUID,
        params.scenarioUUID,
        params.entityGroup,
        params.properties,
        params.timestamp
      )
    );

    return response;
  }
}
