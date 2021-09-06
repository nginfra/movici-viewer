import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { getExtension } from '@/api/contentType';
import { Dataset, UUID } from '@/types';
import Client from '@/api/client';
import {
  AddDataset,
  AddDatasetData,
  DeleteDataset,
  DeleteDatasetData,
  GetDataset,
  GetDatasetDataAsBlob,
  GetDatasetMap,
  GetDatasets,
  UpdateDataset
} from '@/api/requests';
import { downloadAsFile } from '@/store/requests';
import store from '@/store/store';
import ProjectStore from './ProjectStore';

const PlaceholderImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

@Module({
  name: 'datasets',
  namespaced: true,
  dynamic: true,
  store
})
class DatasetsStore extends VuexModule {
  progress = 0;

  @Mutation
  SET_UPLOAD_PROGRESS(progress: { current: number; target: number }) {
    this.progress = Math.round((progress.current / progress.target) * 100);
  }

  @Action({ rawError: true })
  async getMap(uuid: string) {
    const api: Client = this.context.rootGetters.api;

    const resp = await api.request(new GetDatasetMap(uuid), {
      404: () => {}
    });
    if (!resp) {
      return PlaceholderImage;
    }
    const image = btoa(
      new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:${resp.contentType.toLowerCase()};base64,${image}`;
  }

  @Action({ rawError: true })
  async getDatasets(projectUUID?: UUID) {
    projectUUID ??= ProjectStore.activeProjectUUID;

    if (projectUUID) {
      const api: Client = this.context.rootGetters.api,
        datasets = (await api.request(new GetDatasets(projectUUID))) ?? [];

      return datasets;
    }

    return [];
  }

  @Action({ rawError: true })
  async getDataset(uuid: UUID) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new GetDataset(uuid));
  }

  @Action({ rawError: true })
  async addDataset(dataset: Dataset) {
    const projectUUID = ProjectStore.activeProjectUUID;

    if (projectUUID) {
      const api: Client = this.context.rootGetters.api;
      return await api.request(new AddDataset(projectUUID, dataset));
    }
  }

  @Action({ rawError: true })
  async deleteDataset(dataset: Dataset) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new DeleteDataset(dataset.uuid));
  }

  @Action({ rawError: true })
  async updateDataset(dataset: Dataset) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new UpdateDataset(dataset.uuid, dataset));
  }

  @Action({ rawError: true })
  async downloadInitData(dataset: Dataset) {
    const api: Client = this.context.rootGetters.api;
    const resp = await api.request(new GetDatasetDataAsBlob(dataset.uuid));

    if (resp) {
      downloadAsFile(new Blob([resp.data]), `${dataset.name}${getExtension(resp.contentType)}`);
    }
  }

  @Action({ rawError: true })
  async uploadInitData(payload: { uuid: string; file: File }) {
    const api: Client = this.context.rootGetters.api;

    const resp = await api.request(
      new AddDatasetData(payload.uuid, payload.file, (progressEvent: ProgressEvent) => {
        if (progressEvent.lengthComputable) {
          this.SET_UPLOAD_PROGRESS({
            current: progressEvent.loaded,
            target: progressEvent.total
          });
        }
      })
    );

    this.SET_UPLOAD_PROGRESS({ current: 0, target: 1 });
    return resp;
  }

  @Action({ rawError: true })
  async deleteInitData(uuid: string) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new DeleteDatasetData(uuid));
  }
}

export default getModule(DatasetsStore);
