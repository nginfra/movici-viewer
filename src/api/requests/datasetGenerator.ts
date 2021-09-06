import {
  CrudResponse,
  DatasetGenerator,
  DatasetGeneratorCrudResponse,
  DatasetGeneratorDatasetType,
  DatasetGeneratorLog,
  DatasetGeneratorWorkload,
  ShortDatasetGenerator,
  UUID
} from '@/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { datasetGeneratorBase } from '@/api/uri';
import { Request } from '@/api/requests/base';

export class GetDatasetGenerators extends Request<ShortDatasetGenerator[]> {
  projectUUID: UUID;

  constructor(projectUUID: UUID) {
    super();
    this.projectUUID = projectUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${datasetGeneratorBase}${uri.projects}/${this.projectUUID}${uri.generators}`
    };
  }

  makeResponse(resp: AxiosResponse): ShortDatasetGenerator[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return resp.data.generators.map((generator: any) => {
      generator.created_on = new Date(generator.created_on);
      if (generator.last_modified) {
        generator.last_modified = new Date(generator.last_modified);
      }
      return generator;
    });
  }
}

export class GetDatasetGeneratorTypes extends Request<DatasetGeneratorDatasetType[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${datasetGeneratorBase}${uri.dataset_types}`
    };
  }

  makeResponse(resp: AxiosResponse): DatasetGeneratorDatasetType[] {
    return (resp.data.dataset_types as unknown) as DatasetGeneratorDatasetType[];
  }
}

export class GetDatasetGenerator extends Request<DatasetGenerator> {
  generatorUUID: UUID;

  constructor(generatorUUID: UUID) {
    super();
    this.generatorUUID = generatorUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      url: `${datasetGeneratorBase}${uri.generators}/${this.generatorUUID}`
    };
  }
}

export class AddDatasetGenerator extends Request<DatasetGeneratorCrudResponse> {
  payload: DatasetGenerator;
  projectUUID: UUID;
  constructor(projectUUID: UUID, payload: DatasetGenerator) {
    super();
    this.payload = payload;
    this.projectUUID = projectUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${datasetGeneratorBase}${uri.projects}/${this.projectUUID}${uri.generators}`,
      data: this.payload
    };
  }
}

export class UpdateDatasetGenerator extends Request<DatasetGeneratorCrudResponse> {
  payload: DatasetGenerator;
  generatorUUID: UUID;
  constructor(generatorUUID: UUID, payload: DatasetGenerator) {
    super();
    this.payload = payload;
    this.generatorUUID = generatorUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: `${datasetGeneratorBase}${uri.generators}/${this.generatorUUID}`,
      data: this.payload
    };
  }
}

export class DeleteDatasetGenerator extends Request<DatasetGeneratorCrudResponse> {
  generatorUUID: UUID;
  constructor(generatorUUID: UUID) {
    super();
    this.generatorUUID = generatorUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${datasetGeneratorBase}${uri.generators}/${this.generatorUUID}`
    };
  }
}

export class GetDatasetGeneratorWorkloads extends Request<DatasetGeneratorWorkload[]> {
  generatorUUID: UUID;

  constructor(generatorUUID: UUID) {
    super();
    this.generatorUUID = generatorUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      url: `${datasetGeneratorBase}${uri.generators}/${this.generatorUUID}${uri.workloads}`
    };
  }

  makeResponse(resp: AxiosResponse): DatasetGeneratorWorkload[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return resp.data.workloads.map((workload: any) => {
      workload.created_on = new Date(workload.created_on);
      if (typeof workload.payload === 'string') {
        workload.payload = JSON.parse(workload.payload);
      }
      return workload;
    });
  }
}
export class GetDatasetGeneratorLogs extends Request<DatasetGeneratorLog[]> {
  workloadUUID: UUID;

  constructor(workloadUUID: UUID) {
    super();
    this.workloadUUID = workloadUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      url: `${datasetGeneratorBase}${uri.workloads}/${this.workloadUUID}${uri.activityLogs}`
    };
  }

  makeResponse(resp: AxiosResponse): DatasetGeneratorLog[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return resp.data.activity_logs.map((log: any) => {
      log.created_on = new Date(log.created_on);
      return log;
    });
  }
}

export class RunDatasetGenerator extends Request<CrudResponse> {
  generatorUUID: UUID;
  payload: unknown;
  constructor(generatorUUID: UUID, payload: unknown) {
    super();
    this.generatorUUID = generatorUUID;
    this.payload = payload;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${datasetGeneratorBase}${uri.generators}/${this.generatorUUID}${uri.generate}`,
      data: this.payload
    };
  }
}

export class CancelDatasetGenerator extends Request<CrudResponse> {
  generatorUUID: UUID;
  constructor(generatorUUID: UUID) {
    super();
    this.generatorUUID = generatorUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${datasetGeneratorBase}${uri.generators}/${this.generatorUUID}${uri.generate}`
    };
  }
}
