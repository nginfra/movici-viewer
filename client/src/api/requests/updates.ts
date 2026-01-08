import { Request } from "@movici-flow-lib/api/requests/base";
import uri from "./uri";
import type {
  DataAttribute,
  TimelineFilter,
  Update,
  UpdateWithData,
  UUID,
} from "@movici-flow-lib/types";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getDatasetFilterParams } from "./datasets";

export class GetUpdates extends Request<Update[]> {
  scenarioUUID: string;
  timelineFilter: TimelineFilter;
  constructor(scenarioUUID: UUID, filter?: TimelineFilter) {
    super();
    this.scenarioUUID = scenarioUUID;
    this.timelineFilter = filter ?? {};
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: "get",
      url: `${uri.scenarios}/${this.scenarioUUID}${uri.updates}`,
      params: this.timelineFilter,
    };
  }

  makeResponse(resp: AxiosResponse): Update[] {
    return resp.data.updates as Update[];
  }
}

export class GetUpdateWithData extends Request<UpdateWithData> {
  updateUUID: UUID;
  entityGroup?: string;
  properties?: DataAttribute[];

  constructor(updateUUID: UUID, entityGroup?: string, properties?: DataAttribute[]) {
    super();
    this.updateUUID = updateUUID;
    this.entityGroup = entityGroup;
    this.properties = properties;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: "get",
      url: `${uri.updates}/${this.updateUUID}`,
      params: getDatasetFilterParams(this.entityGroup, this.properties),
    };
  }
}
