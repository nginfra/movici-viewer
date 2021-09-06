import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { dataEngineBase } from '@/api/uri';
import {
  DatasetSchema,
  DatasetType,
  DatasetTypeCrudResponse,
  EntityType,
  EntityTypeCrudResponse,
  PropertyType,
  PropertyTypeCrudResponse
} from '@/types';
import { Request } from '@/api/requests/base';

export class GetDatasetTypes extends Request<DatasetType[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${dataEngineBase}${uri.schema}${uri.dataset_types}`
    };
  }
  makeResponse(resp: AxiosResponse): DatasetType[] {
    return resp.data.dataset_types as DatasetType[];
  }
}

export class GetEntityTypes extends Request<EntityType[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${dataEngineBase}${uri.schema}${uri.entity_types}`
    };
  }
  makeResponse(resp: AxiosResponse): EntityType[] {
    return resp.data.entity_types as EntityType[];
  }
}

export class GetPropertyTypes extends Request<PropertyType[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${dataEngineBase}${uri.schema}${uri.property_types}`
    };
  }
  makeResponse(resp: AxiosResponse): PropertyType[] {
    return resp.data.property_types as PropertyType[];
  }
}

export class GetDatasetSchema extends Request<DatasetSchema> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${dataEngineBase}${uri.schema}`
    };
  }
}

export class AddDatasetType extends Request<DatasetTypeCrudResponse> {
  datasetType: DatasetType;
  constructor(datasetType: DatasetType) {
    super();
    this.datasetType = datasetType;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${dataEngineBase}${uri.schema}${uri.dataset_types}`,
      data: this.datasetType
    };
  }
}

export class UpdateDatasetType extends Request<DatasetTypeCrudResponse> {
  datasetType: DatasetType;
  datasetTypeUUID: string;
  constructor(datasetType: DatasetType, datasetTypeUUID: string) {
    super();
    this.datasetType = datasetType;
    this.datasetTypeUUID = datasetTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: `${dataEngineBase}${uri.schema}${uri.dataset_types}/${this.datasetTypeUUID}`,
      data: this.datasetType
    };
  }
}

export class DeleteDatasetType extends Request<DatasetTypeCrudResponse> {
  datasetTypeUUID: string;
  constructor(datasetTypeUUID: string) {
    super();
    this.datasetTypeUUID = datasetTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${dataEngineBase}${uri.schema}${uri.dataset_types}/${this.datasetTypeUUID}`
    };
  }
}

export class AddEntityType extends Request<EntityTypeCrudResponse> {
  entityType: EntityType;
  constructor(entityType: EntityType) {
    super();
    this.entityType = entityType;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${dataEngineBase}${uri.schema}${uri.entity_types}`,
      data: this.entityType
    };
  }
}

export class UpdateEntityType extends Request<EntityTypeCrudResponse> {
  entityType: EntityType;
  entityTypeUUID: string;
  constructor(entityType: EntityType, entityTypeUUID: string) {
    super();
    this.entityType = entityType;
    this.entityTypeUUID = entityTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: `${dataEngineBase}${uri.schema}${uri.entity_types}/${this.entityTypeUUID}`,
      data: this.entityType
    };
  }
}

export class DeleteEntityType extends Request<EntityTypeCrudResponse> {
  entityTypeUUID: string;
  constructor(entityTypeUUID: string) {
    super();
    this.entityTypeUUID = entityTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${dataEngineBase}${uri.schema}${uri.entity_types}/${this.entityTypeUUID}`
    };
  }
}

export class AddPropertyType extends Request<PropertyTypeCrudResponse> {
  propertyType: PropertyType;
  constructor(propertyType: PropertyType) {
    super();
    this.propertyType = propertyType;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${dataEngineBase}${uri.schema}${uri.property_types}`,
      data: this.propertyType
    };
  }
}

export class UpdatePropertyType extends Request<PropertyTypeCrudResponse> {
  propertyType: PropertyType;
  propertyTypeUUID: string;
  constructor(propertyType: PropertyType, propertyTypeUUID: string) {
    super();
    this.propertyType = propertyType;
    this.propertyTypeUUID = propertyTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: `${dataEngineBase}${uri.schema}${uri.property_types}/${this.propertyTypeUUID}`,
      data: this.propertyType
    };
  }
}

export class DeletePropertyType extends Request<PropertyTypeCrudResponse> {
  propertyTypeUUID: string;
  constructor(propertyTypeUUID: string) {
    super();
    this.propertyTypeUUID = propertyTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${dataEngineBase}${uri.schema}${uri.property_types}/${this.propertyTypeUUID}`
    };
  }
}
