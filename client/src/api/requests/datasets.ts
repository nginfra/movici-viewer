import { Request } from '@movici-flow-lib/api/requests/base'
import uri from './uri'
import type { DataAttribute, Dataset, DatasetWithData, UUID } from '@movici-flow-lib/types'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface DatasetFilter {
  properties?: string // comma separated string
  entity_group?: UUID
  components?: string // comma separated string
}
interface ScenarioStateFilter extends DatasetFilter {
  dataset_uuid?: UUID
  dataset_name?: string
  timestamp?: number
}

export class GetDatasets extends Request<Dataset[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}`
    }
  }

  makeResponse(resp: AxiosResponse): Dataset[] {
    return resp.data.datasets
  }
}

export class GetDataset extends Request<Dataset> {
  datasetUUID: UUID

  constructor(datasetUUID: UUID) {
    super()
    this.datasetUUID = datasetUUID
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}/${this.datasetUUID}`
    }
  }
  makeResponse(resp: AxiosResponse): Dataset {
    return resp.data
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GetDatasetData<T = any> extends Request<DatasetWithData<T>> {
  datasetUUID: string
  entityGroup?: string
  properties?: DataAttribute[]

  constructor(datasetUUID: UUID, entityGroup?: string, properties?: DataAttribute[]) {
    super()
    this.datasetUUID = datasetUUID
    this.entityGroup = entityGroup
    this.properties = properties
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}/${this.datasetUUID}${uri.data}`,
      // The local server currently doesn't support dataset filtering, but we'll leave it in the request anyway
      params: getDatasetFilterParams(this.entityGroup, this.properties)
    }
  }

  makeResponse(resp: AxiosResponse): DatasetWithData<T> {
    return resp.data
  }
}

export class GetDatasetDataAsBlob extends Request<{ data: Blob; contentType: string }> {
  datasetUUID: string
  entityGroup?: string
  properties?: DataAttribute[]

  constructor(datasetUUID: UUID, entityGroup?: string, properties?: DataAttribute[]) {
    super()
    this.datasetUUID = datasetUUID
    this.entityGroup = entityGroup
    this.properties = properties
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.datasets}/${this.datasetUUID}${uri.data}`,
      params: getDatasetFilterParams(this.entityGroup, this.properties),
      responseType: 'blob'
    }
  }
  makeResponse(resp: AxiosResponse): { data: Blob; contentType: string } {
    return {
      data: resp.data,
      contentType: resp.headers['content-type']
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GetScenarioState<T = any> extends Request<DatasetWithData<T>> {
  datasetUUID: UUID
  scenarioUUID: UUID
  entityGroup?: string
  properties?: DataAttribute[]
  timestamp?: number

  constructor(
    datasetUUID: UUID,
    scenarioUUID: UUID,
    entityGroup?: string,
    properties?: DataAttribute[],
    timestamp?: number
  ) {
    super()
    this.datasetUUID = datasetUUID
    this.scenarioUUID = scenarioUUID
    this.entityGroup = entityGroup
    this.properties = properties
    this.timestamp = timestamp
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}/${this.scenarioUUID}${uri.state}`,
      params: this.getStateFilterParams()
    }
  }

  makeResponse(resp: AxiosResponse): DatasetWithData<T> {
    return resp.data
  }

  getStateFilterParams(): ScenarioStateFilter {
    const params: ScenarioStateFilter = getDatasetFilterParams(this.entityGroup, this.properties)
    params.dataset_uuid = this.datasetUUID
    if (this.timestamp !== undefined) {
      params.timestamp = this.timestamp
    }
    return params
  }
}

export function getDatasetFilterParams(
  entityGroup?: string,
  properties?: DataAttribute[]
): DatasetFilter {
  if (!entityGroup) {
    return {}
  }

  if (!properties?.length) {
    return {
      entity_group: entityGroup
    }
  }
  const components = new Set()
  const props = new Set()
  properties.forEach((p) => {
    props.add(p.name)
  })
  return {
    entity_group: entityGroup,
    properties: Array.from(props).join(','),
    components: components.size ? Array.from(components).join(',') : undefined
  }
}
