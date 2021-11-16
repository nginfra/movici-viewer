import { ComponentProperty, Dataset, DatasetWithData, UUID } from '@movici-flow-common/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri from '@movici-flow-common/api/requests/uri';
import { Request } from '@movici-flow-common/api/requests/base';

export interface DatasetFilter {
  properties?: string; // comma separated string
  entity_group?: UUID;
  components?: string; // comma separated string
}
interface ScenarioStateFilter extends DatasetFilter {
  dataset_uuid?: UUID;
  dataset_name?: string;
  timestamp?: number;
}

export class GetDatasets extends Request<Dataset[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}`
    };
  }

  makeResponse(resp: AxiosResponse): Dataset[] {
    return resp.data.datasets.map((d: unknown) => new Dataset(d as Partial<Dataset>));
  }
}

export class GetDataset extends Request<Dataset> {
  datasetUUID: UUID;

  constructor(datasetUUID: UUID) {
    super();
    this.datasetUUID = datasetUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}/${this.datasetUUID}`
    };
  }
  makeResponse(resp: AxiosResponse): Dataset {
    return new Dataset(resp.data as Partial<Dataset>);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GetDatasetData<T = any> extends Request<DatasetWithData<T>> {
  datasetUUID: string;
  entityGroup?: string;
  properties?: ComponentProperty[];

  constructor(datasetUUID: UUID, entityGroup?: string, properties?: ComponentProperty[]) {
    super();
    this.datasetUUID = datasetUUID;
    this.entityGroup = entityGroup;
    this.properties = properties;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}/${this.datasetUUID}${uri.data}`,
      // The local server currently doesn't support dataset filtering, but we'll leave it in the request anyway
      params: getDatasetFilterParams(this.entityGroup, this.properties)
    };
  }

  makeResponse(resp: AxiosResponse): DatasetWithData<T> {
    return new DatasetWithData(resp.data);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GetScenarioState<T = any> extends Request<DatasetWithData<T>> {
  datasetUUID: UUID;
  scenarioUUID: UUID;
  entityGroup?: string;
  properties?: ComponentProperty[];
  timestamp?: number;

  constructor(
    datasetUUID: UUID,
    scenarioUUID: UUID,
    entityGroup?: string,
    properties?: ComponentProperty[],
    timestamp?: number
  ) {
    super();
    this.datasetUUID = datasetUUID;
    this.scenarioUUID = scenarioUUID;
    this.entityGroup = entityGroup;
    this.properties = properties;
    this.timestamp = timestamp;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}/${this.scenarioUUID}${uri.state}`,
      params: this.getStateFilterParams()
    };
  }

  makeResponse(resp: AxiosResponse): DatasetWithData<T> {
    return new DatasetWithData(resp.data);
  }

  getStateFilterParams(): ScenarioStateFilter {
    const params: ScenarioStateFilter = getDatasetFilterParams(this.entityGroup, this.properties);
    params.dataset_uuid = this.datasetUUID;
    if (this.timestamp !== undefined) {
      params.timestamp = this.timestamp;
    }
    return params;
  }
}

export function getDatasetFilterParams(
  entityGroup?: string,
  properties?: ComponentProperty[]
): DatasetFilter {
  if (!entityGroup) {
    return {};
  }

  if (!properties?.length) {
    return {
      entity_group: entityGroup
    };
  }
  const components = new Set();
  const props = new Set();
  properties.forEach(p => {
    if (p.component) {
      components.add(p.component);
    }
    props.add(p.name);
  });
  return {
    entity_group: entityGroup,
    properties: Array.from(props).join(','),
    components: components.size ? Array.from(components).join(',') : undefined
  };
}
