import { AxiosRequestConfig } from 'axios';
import uri from '@movici-flow-common/api/requests/uri';
import { DatasetSummary, UUID } from '@movici-flow-common/types';
import { Request } from '@movici-flow-common/api/requests/base';

export class GetDatasetSummary extends Request<DatasetSummary> {
  datasetUUID: string;
  constructor(datasetUUID: UUID) {
    super();
    this.datasetUUID = datasetUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}/${this.datasetUUID}${uri.summary}`
    };
  }
}

export class GetScenarioSummary extends Request<DatasetSummary> {
  scenarioUUID: UUID;
  datasetUUID: UUID;
  constructor(scenarioUUID: UUID, datasetUUID: UUID) {
    super();
    this.scenarioUUID = scenarioUUID;
    this.datasetUUID = datasetUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}/${this.scenarioUUID}${uri.summary}`,
      params: {
        dataset_uuid: this.datasetUUID
      }
    };
  }
}
