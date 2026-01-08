import { Request } from "@movici-flow-lib/api/requests/base";
import uri from "./uri";
import type { DatasetSummary, UUID } from "@movici-flow-lib/types";
import type { AxiosRequestConfig } from "axios";

export class GetDatasetSummary extends Request<DatasetSummary> {
  datasetUUID: string;
  constructor(datasetUUID: UUID) {
    super();
    this.datasetUUID = datasetUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: "get",
      url: `${uri.datasets}/${this.datasetUUID}${uri.summary}`,
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
      method: "get",
      url: `${uri.scenarios}/${this.scenarioUUID}${uri.summary}`,
      params: {
        dataset_uuid: this.datasetUUID,
      },
    };
  }
}
