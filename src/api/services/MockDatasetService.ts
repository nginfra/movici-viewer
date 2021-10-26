/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, DatasetService } from '~flow/api';
import { ComponentProperty, Dataset, DatasetWithData, UUID } from '~flow/types';
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
    return new Promise<Dataset[]>(resolve => {
      setTimeout(() => resolve(mocks('./datasets.json')), MOCK_TIMEOUT);
    });
  }

  async getData<T>(params: getDataParams) {
    return new Promise<DatasetWithData<T>>(resolve => {
      resolve((mocks('./dataset_with_data.json') as unknown) as DatasetWithData<T>);
    });
  }

  async getState<T>(params: getStateParams) {
    return new Promise<DatasetWithData<T> | null>(resolve => {
      resolve((mocks('./dataset_with_state.json') as unknown) as DatasetWithData<T>);
    });
  }
}
