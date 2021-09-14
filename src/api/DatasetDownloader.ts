import { ComponentProperty, Update, UpdateWithData } from '@/flow/types';
import Client from '@/api/client';
import { GetDatasetData, GetScenarioState, GetUpdates, GetUpdateWithData } from '@/api/requests';

export interface DatasetStoreConfig {
  client: Client;
  datasetUUID: string;
  scenarioUUID?: string;
}

export class DatasetDownloader {
  client: Client;
  datasetUUID: string;
  scenarioUUID: string | null;

  constructor(config: DatasetStoreConfig) {
    this.client = config.client;
    this.datasetUUID = config.datasetUUID;
    this.scenarioUUID = config.scenarioUUID ?? null;
  }

  async getInitialData<T>(params: {
    entityGroup: string;
    properties?: ComponentProperty[];
  }): Promise<T> {
    const resp = await this.client.request(
      new GetDatasetData(this.datasetUUID, params.entityGroup, params.properties)
    );

    const entityData = resp?.data && resp.data[params.entityGroup];

    if (!entityData) {
      throw new Error(`${params.entityGroup} not found in dataset ${this.datasetUUID}`);
    }
    return (entityData as unknown) as T;
  }

  async getDatasetState<T>(params: {
    entityGroup: string;
    properties?: ComponentProperty[];
    timestamp?: number;
  }): Promise<T> {
    if (!this.scenarioUUID) {
      return await this.getInitialData<T>(params);
    }
    const resp = await this.client.request(
      new GetScenarioState(
        this.datasetUUID,
        this.scenarioUUID,
        params.entityGroup,
        params.properties,
        params.timestamp
      )
    );

    const entityData = resp?.data && resp.data[params.entityGroup];

    if (!entityData) {
      throw new Error(`${params.entityGroup} not found in dataset ${this.datasetUUID}`);
    }
    return (entityData as unknown) as T;
  }

  async getUpdateList() {
    if (!this.scenarioUUID) {
      return [];
    }
    const allUpdates = await this.client.request(new GetUpdates(this.scenarioUUID));
    if (!allUpdates) {
      throw new Error('Error when downloading updates');
    }
    return allUpdates.filter(upd => upd.dataset_uuid === this.datasetUUID);
  }

  async getUpdateData(
    update: Update,
    entityGroup: string,
    properties: ComponentProperty[]
  ): Promise<UpdateWithData> {
    const data = await this.client.request(
      new GetUpdateWithData(update.uuid, entityGroup, properties)
    );
    if (!data) {
      throw new Error('Error when downloading updates');
    }
    return data;
  }
}
