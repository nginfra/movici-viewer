import { Client, DatasetService } from '@/flow/api';
import { GetDatasetData, GetScenarioState } from '@/flow/api/requests';
import { ComponentProperty, Dataset, DatasetWithData, UUID } from '@/flow/types';
import { NumberSizeMap } from '@/flow/visualizers/maps/sizeMaps';
import mocks, { MOCK_TIMEOUT } from '../mocks';

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

  async list(project_uuid: string) {
    // return (await this.client?.request(new GetDatasets(project_uuid))) ?? [];

    return new Promise<Dataset[]>(resolve => {
      setTimeout(() => resolve(mocks('./datasets.json')), MOCK_TIMEOUT);
    });
  }

  async getData<T>(params: getDataParams): Promise<DatasetWithData<T> | null> {
    // const { datasetUUID, entityGroup, properties } = params;
    // return await this.client.request(new GetDatasetData<T>(datasetUUID, entityGroup, properties));

    return new Promise<DatasetWithData<T>>(resolve => {
      resolve((mocks('./dataset_with_data.json') as unknown) as DatasetWithData<T>);
    });
  }

  // https://staging.movici.nl/data-engine/v4/scenarios/b39c3fb6-86e2-4650-a582-93de2537cae8/summary?dataset_uuid=e12c43eb-93e8-453a-b573-5fadaffe8a90
  async getState<T>(params: getStateParams): Promise<DatasetWithData<T> | null> {
    // const { datasetUUID, scenarioUUID, entityGroup, properties, timestamp } = params;

    // return await this.client.request(
    //   new GetScenarioState(datasetUUID, scenarioUUID, entityGroup, properties, timestamp)
    // );

    return new Promise(resolve => {
      resolve((mocks('./dataset_with_state.json') as unknown) as DatasetWithData<T>);
    });
  }
}
