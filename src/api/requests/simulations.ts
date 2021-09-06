import { Request } from '@/api/requests/base';
import { CrudResponse, Simulation, SimulationControlMessage, UUID } from '@/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { simulationControlBase } from '@/api/uri';

export class GetSimulations extends Request<Simulation[]> {
  projectUUID: UUID;

  constructor(projectUUID: UUID) {
    super();
    this.projectUUID = projectUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${simulationControlBase}${uri.projects}/${this.projectUUID}${uri.simulations}`
    };
  }

  makeResponse(resp: AxiosResponse): Simulation[] {
    return resp.data.simulations;
  }
}

export class GetSimulation extends Request<Simulation> {
  scenarioUUID: UUID;

  constructor(scenarioUUID: UUID) {
    super();
    this.scenarioUUID = scenarioUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${simulationControlBase}${uri.simulations}/${this.scenarioUUID}`
    };
  }
}

export class RunSimulation extends Request<CrudResponse> {
  scenarioUUID: UUID;

  constructor(scenarioUUID: UUID) {
    super();
    this.scenarioUUID = scenarioUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${simulationControlBase}${uri.simulations}/${this.scenarioUUID}`
    };
  }
}
export class DeleteSimulation extends Request<CrudResponse> {
  scenarioUUID: UUID;

  constructor(scenarioUUID: UUID) {
    super();
    this.scenarioUUID = scenarioUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${simulationControlBase}${uri.simulations}/${this.scenarioUUID}`
    };
  }
}

export class GetSimulationLogs extends Request<string> {
  scenarioUUID: UUID;

  constructor(scenarioUUID: UUID) {
    super();
    this.scenarioUUID = scenarioUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${simulationControlBase}${uri.simulations}/${this.scenarioUUID}${uri.logs}`
    };
  }
}

export class GetSimulationControlMessage extends Request<SimulationControlMessage> {
  scenarioUUID: UUID;

  constructor(scenarioUUID: UUID) {
    super();
    this.scenarioUUID = scenarioUUID;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${simulationControlBase}${uri.simulations}/${this.scenarioUUID}${uri.control}`
    };
  }
}

export class SendSimulationControlMessage extends Request<CrudResponse> {
  scenarioUUID: UUID;
  payload: SimulationControlMessage;
  constructor(scenarioUUID: UUID, payload: SimulationControlMessage) {
    super();
    this.scenarioUUID = scenarioUUID;
    this.payload = payload;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${simulationControlBase}${uri.simulations}/${this.scenarioUUID}${uri.control}`,
      data: this.payload
    };
  }
}

export class SendSimulationUpdateRequest extends Request<CrudResponse> {
  scenarioUUID: UUID;
  modelName: string;
  payload: unknown;
  constructor(scenarioUUID: UUID, modelName: string, payload: unknown) {
    super();
    this.scenarioUUID = scenarioUUID;
    this.payload = payload;
    this.modelName = modelName;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${simulationControlBase}${uri.simulations}/${this.scenarioUUID}${uri.updates}/${this.modelName}`,
      data: this.payload
    };
  }
}
