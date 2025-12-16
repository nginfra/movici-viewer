import type { BaseRequest } from "@movici-flow-lib/api";
import type { FetchRequestOptions, FetchRequestService, IClient } from "@movici-flow-lib/types";
import { GetDatasetDataAsBlob, GetScenario } from "../requests";

export default class LocalFetchRequestService implements FetchRequestService {
  client: IClient;
  constructor(client: IClient) {
    this.client = client;
  }
  getRequest<T extends keyof FetchRequestOptions>(
    request: T,
    options: FetchRequestOptions[T],
  ): { url: string; options: RequestInit } {
    let req: BaseRequest<unknown>;
    switch (request) {
      case "datasetDataBlob":
        req = new GetDatasetDataAsBlob(
          (options as FetchRequestOptions["datasetDataBlob"]).datasetUUID,
        );
        break;

      case "scenario":
        req = new GetScenario((options as FetchRequestOptions["scenario"]).scenarioUUID);
        break;
      default:
        throw new Error(`Unknown request identifier ${request} `);
    }
    return this.client.asFetchRequest(req);
  }
}
