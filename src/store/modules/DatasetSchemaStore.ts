import {
  AddDatasetType,
  AddEntityType,
  AddPropertyType,
  DeleteDatasetType,
  DeleteEntityType,
  DeletePropertyType,
  GetDatasetTypes,
  GetEntityTypes,
  GetPropertyTypes,
  UpdateDatasetType,
  UpdateEntityType,
  UpdatePropertyType
} from '@/api/requests';
import { DatasetType, EntityType, PropertyType } from '@/types';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store/store';

@Module({
  name: 'datasetSchema',
  namespaced: true,
  dynamic: true,
  store: store
})
class DatasetSchemaStore extends VuexModule {
  datasetTypes: DatasetType[] = [];
  entityTypes: EntityType[] = [];
  propertyTypes: PropertyType[] = [];

  @Mutation
  SET_DATASET_TYPES(datasetTypes: DatasetType[]) {
    this.datasetTypes = datasetTypes;
  }
  @Mutation
  SET_ENTITY_TYPES(entityTypes: EntityType[]) {
    this.entityTypes = entityTypes;
  }
  @Mutation
  SET_PROPERTY_TYPES(propertyTypes: PropertyType[]) {
    this.propertyTypes = propertyTypes;
  }

  @Action({ rawError: true, commit: 'SET_DATASET_TYPES' })
  async getDatasetTypes() {
    const api = this.context.rootGetters.api;
    return await api.request(new GetDatasetTypes());
  }
  @Action({ rawError: true, commit: 'SET_ENTITY_TYPES' })
  async getEntityTypes() {
    const api = this.context.rootGetters.api;
    return await api.request(new GetEntityTypes());
  }
  @Action({ rawError: true, commit: 'SET_PROPERTY_TYPES' })
  async getPropertyTypes() {
    const api = this.context.rootGetters.api;
    return await api.request(new GetPropertyTypes());
  }

  @Action({ rawError: true })
  async addDatasetType(datasetType: DatasetType) {
    const api = this.context.rootGetters.api;
    return await api.request(new AddDatasetType(datasetType));
  }
  @Action({ rawError: true })
  async deleteDatasetType(datasetType: Required<DatasetType>) {
    const api = this.context.rootGetters.api;
    return await api.request(new DeleteDatasetType(datasetType.uuid));
  }
  @Action({ rawError: true })
  async updateDatasetType(datasetType: Required<DatasetType>) {
    const api = this.context.rootGetters.api;
    return await api.request(new UpdateDatasetType(datasetType, datasetType.uuid));
  }

  @Action({ rawError: true })
  async addEntityType(entityType: EntityType) {
    const api = this.context.rootGetters.api;
    return await api.request(new AddEntityType(entityType));
  }
  @Action({ rawError: true })
  async deleteEntityType(entityType: Required<EntityType>) {
    const api = this.context.rootGetters.api;
    return await api.request(new DeleteEntityType(entityType.uuid));
  }
  @Action({ rawError: true })
  async updateEntityType(entityType: Required<EntityType>) {
    const api = this.context.rootGetters.api;
    return await api.request(new UpdateEntityType(entityType, entityType.uuid));
  }

  @Action({ rawError: true })
  async addPropertyType(propertyType: PropertyType) {
    const api = this.context.rootGetters.api;
    return await api.request(new AddPropertyType(propertyType));
  }
  @Action({ rawError: true })
  async deletePropertyType(propertyType: Required<PropertyType>) {
    const api = this.context.rootGetters.api;
    return await api.request(new DeletePropertyType(propertyType.uuid));
  }
  @Action({ rawError: true })
  async updatePropertyType(propertyType: Required<PropertyType>) {
    const api = this.context.rootGetters.api;
    return await api.request(new UpdatePropertyType(propertyType, propertyType.uuid));
  }
}

export default getModule(DatasetSchemaStore);
