import type {
  DataAttribute,
  Dataset,
  DatasetService,
  DatasetWithData,
  IClient,
  UUID,
} from "@movici-flow-lib/types";
import { GetDataset, GetDatasetData, GetDatasets, GetScenarioState } from "@/api/requests/datasets";

type getDataParams = {
  datasetUUID: UUID;
  entityGroup?: string;
  properties?: DataAttribute[];
};

type getStateParams = {
  datasetUUID: UUID;
  scenarioUUID: UUID;
  entityGroup: string;
  timestamp: number;
  properties: DataAttribute[];
};
export default class LocalDatasetService implements DatasetService {
  client: IClient;

  constructor(client: IClient) {
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
      new GetScenarioState(datasetUUID, scenarioUUID, entityGroup, properties, timestamp),
    );
  }
  async getMetaData(datasetUUID: string): Promise<Dataset | null> {
    return await this.client.request(new GetDataset(datasetUUID));
  }
}
