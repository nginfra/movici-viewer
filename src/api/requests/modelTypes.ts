import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { dataEngineBase } from '@/api/uri';
import { ModelType } from '@/types';
import { Request } from '@/api/requests/base';

export class GetModelTypes extends Request<ModelType[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${dataEngineBase}${uri.modelTypes}`
    };
  }
  makeResponse(resp: AxiosResponse): ModelType[] {
    return resp.data.model_types as ModelType[];
  }
}

export class GetModelType extends Request<ModelType> {
  modelTypeUUID: string;
  constructor(modelTypeUUID: string) {
    super();
    this.modelTypeUUID = modelTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${dataEngineBase}${uri.modelTypes}/${this.modelTypeUUID}`
    };
  }
}

export class AddModelType extends Request<unknown> {
  modelType: ModelType;
  constructor(modelType: ModelType) {
    super();
    this.modelType = modelType;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${dataEngineBase}${uri.modelTypes}`,
      data: this.modelType
    };
  }
}

export class UpdateModelType extends Request<unknown> {
  modelType: ModelType;
  modelTypeUUID: string;
  constructor(modelTypeUUID: string, modelType: ModelType) {
    super();
    this.modelType = modelType;
    this.modelTypeUUID = modelTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: `${dataEngineBase}${uri.modelTypes}/${this.modelTypeUUID}`,
      data: this.modelType
    };
  }
}

export class DeleteModelType extends Request<unknown> {
  modelTypeUUID: string;
  constructor(modelTypeUUID: string) {
    super();
    this.modelTypeUUID = modelTypeUUID;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${dataEngineBase}${uri.modelTypes}/${this.modelTypeUUID}`
    };
  }
}
