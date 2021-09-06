import { ModelType } from '@/types';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Client from '@/api/client';
import {
  AddModelType,
  DeleteModelType,
  GetModelType,
  GetModelTypes,
  UpdateModelType
} from '@/api/requests';

@Module
export default class ModelStore extends VuexModule {
  modelTypes: ModelType[] = [];
  currentModelType: ModelType | null = null;
  currentModelTypeUUID: string | null = null;

  @Mutation
  SET_MODEL_TYPES(modelTypes: ModelType[]) {
    this.modelTypes = modelTypes;
  }
  @Mutation
  SET_CURRENT_MODEL_TYPE(modelType: ModelType) {
    this.currentModelType = modelType;
  }
  @Mutation
  SET_CURRENT_MODEL_TYPE_UUID(uuid: string) {
    this.currentModelTypeUUID = uuid;
  }

  @Action({ rawError: true, commit: 'SET_MODEL_TYPES' })
  async getModelTypes() {
    const api: Client = this.context.getters.api;
    return await api.request(new GetModelTypes());
  }

  @Action({ rawError: true })
  async getModelType(uuid: string) {
    const { commit } = this.context;
    const api: Client = this.context.getters.api;

    commit('SET_CURRENT_MODEL_TYPE', null);
    commit('SET_CURRENT_MODEL_TYPE_UUID', null);
    const modelType = await api.request(new GetModelType(uuid));

    commit('SET_CURRENT_MODEL_TYPE', modelType);
    commit('SET_CURRENT_MODEL_TYPE_UUID', uuid);
  }

  @Action({ rawError: true })
  async updateModelType() {
    const api: Client = this.context.getters.api;
    if (this.currentModelTypeUUID && this.currentModelType) {
      return await api.request(
        new UpdateModelType(this.currentModelTypeUUID, this.currentModelType)
      );
    }
  }
  @Action({ rawError: true })
  async addModelType() {
    const api: Client = this.context.getters.api;

    if (this.currentModelType) {
      return await api.request(new AddModelType(this.currentModelType));
    }
  }
  @Action({ rawError: true })
  async deleteModelType(modelType: ModelType) {
    const api: Client = this.context.getters.api;
    return await api.request(new DeleteModelType(modelType.uuid));
  }

  @Action({ rawError: true, commit: 'SET_CURRENT_MODEL_TYPE' })
  setCurrentModelType(modelType: ModelType) {
    return modelType;
  }
}
