import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import {
  DatasetGenerator,
  DatasetGeneratorDataset,
  DatasetGeneratorDatasetType,
  GeoJSONPolygon,
  ShortDatasetGenerator
} from '@/types';
import Client from '@/api/client';
import {
  AddDatasetGenerator,
  CancelDatasetGenerator,
  DeleteDatasetGenerator,
  GetDatasetGenerator,
  GetDatasetGeneratorLogs,
  GetDatasetGenerators,
  GetDatasetGeneratorTypes,
  GetDatasetGeneratorWorkloads,
  RunDatasetGenerator,
  UpdateDatasetGenerator
} from '@/api/requests';
import store from '@/store/store';
import ProjectStore from './ProjectStore';
import cloneDeep from 'lodash/cloneDeep';

function find_dataset(
  type: string,
  currentDataset: DatasetGeneratorDataset
): DatasetGeneratorDataset | null {
  let currentChild, result;

  if (type === currentDataset.type) {
    // This is the one, return it
    return currentDataset;
  } else {
    if (currentDataset.childs === undefined) {
      return null;
    }

    // Loop over child types
    for (let childTypeIdx = 0; childTypeIdx < currentDataset.childs.length; ++childTypeIdx) {
      const currentChildType = currentDataset.childs[childTypeIdx];

      for (let childIdx = 0; childIdx < currentChildType.datasets.length; ++childIdx) {
        currentChild = currentChildType.datasets[childIdx];
        // Search in the current child
        result = find_dataset(type, currentChild);

        if (result !== null) {
          return result;
        }
      }
    }

    return null;
  }
}

/**
 * Filters the datasets tree, so that it doesn't
 * contain dataset_type after this operation.
 *
 * @param {*} datasets
 * @param {*} dataset_type
 * @returns
 */
function filterDatasets(datasets: DatasetGeneratorDataset[], dataset_type: string) {
  for (let i = 0; i < datasets.length; ++i) {
    const dataset = datasets[i];

    if (dataset.childs !== undefined) {
      for (let j = 0; j < dataset.childs.length; ++j) {
        const child = dataset.childs[j];
        dataset.childs[j].datasets = filterDatasets(child.datasets, dataset_type);
      }
    }
  }

  return datasets.filter(function (dataset) {
    return dataset.type !== dataset_type;
  });
}

function addDataset(
  datasets: DatasetGeneratorDataset[],
  dataset: DatasetGeneratorDataset,
  parent_type: string,
  child_type: string
) {
  // First look for the parent
  const parent = find_parent_dataset(datasets, parent_type);

  if (parent === undefined || parent === null) {
    // No parent, add to this array
    add_dataset_to_array_if_not_exists(datasets, dataset);
    return datasets;
  }

  const child = find_child_in_dataset(parent, child_type);
  add_dataset_to_array_if_not_exists(child.datasets, dataset);
  return datasets;
}

function updateDataset(datasets: DatasetGeneratorDataset[], new_dataset: DatasetGeneratorDataset) {
  let existing_dataset = null;

  for (let i = 0; i < datasets.length; ++i) {
    const result = find_dataset(new_dataset.type, datasets[i]);

    if (result !== null) {
      existing_dataset = result;
      break;
    }
  }

  if (existing_dataset !== null) {
    Object.assign(existing_dataset, new_dataset);
  }

  return datasets;
}

function add_dataset_to_array_if_not_exists(
  datasets: DatasetGeneratorDataset[],
  new_dataset: DatasetGeneratorDataset
) {
  if (
    datasets.filter(function (dataset) {
      return dataset.type === new_dataset.type;
    }).length > 0
  ) {
    return;
  }

  datasets.push(new_dataset);
}

function find_parent_dataset(datasets: DatasetGeneratorDataset[], parent_type: string) {
  for (let i = 0; i < datasets.length; ++i) {
    const result = find_dataset(parent_type, datasets[i]);

    if (result !== null) {
      return result;
    }
  }

  return null;
}

function find_child_in_dataset(dataset: DatasetGeneratorDataset, child_type: string) {
  if (dataset.childs === undefined) {
    dataset.childs = [];
  }

  for (let i = 0; i < dataset.childs.length; ++i) {
    const child = dataset.childs[i];
    if (child.child_type === child_type) {
      return child;
    }
  }

  const child = { child_type: child_type, datasets: [] };
  dataset.childs.push(child);
  return child;
}

@Module({
  name: 'datasetGenerators',
  namespaced: true,
  dynamic: true,
  store
})
class DatasetGeneratorsStore extends VuexModule {
  dataset_generators: ShortDatasetGenerator[] = [];
  dataset_types: DatasetGeneratorDatasetType[] = [];
  current_dataset_generator: DatasetGenerator | null = null;
  current_dataset_generator_uuid: string | null = null;

  @Mutation
  SET_DATASET_GENERATORS(dataset_generators: ShortDatasetGenerator[]) {
    this.dataset_generators = dataset_generators;
  }
  @Mutation
  SET_DATASET_TYPES(dataset_types: DatasetGeneratorDatasetType[]) {
    this.dataset_types = dataset_types;
  }
  @Mutation
  SET_CURRENT_GENERATOR(dataset_generator: DatasetGenerator) {
    this.current_dataset_generator = dataset_generator;
  }
  @Mutation
  SET_CURRENT_GENERATOR_UUID(generator_uuid: string) {
    this.current_dataset_generator_uuid = generator_uuid;
  }

  @Action({ rawError: true })
  async getDatasetGenerators() {
    const projectUUID = ProjectStore.activeProjectUUID;
    if (projectUUID) {
      const api: Client = this.context.rootGetters.api,
        resp = await api.request(new GetDatasetGenerators(projectUUID), {
          504: () => {}
        });

      if (resp) {
        this.SET_DATASET_GENERATORS(resp);
        return resp;
      }
    }
  }

  @Action({ rawError: true })
  async getDGSDatasetTypes() {
    const api: Client = this.context.rootGetters.api,
      resp = await api.request(new GetDatasetGeneratorTypes());

    if (resp) {
      this.SET_DATASET_TYPES(resp);
      return resp;
    }
  }

  @Action({ rawError: true })
  async getDatasetGenerator(uuid: string) {
    const api: Client = this.context.rootGetters.api,
      resp = await api.request(new GetDatasetGenerator(uuid));

    if (resp) {
      this.SET_CURRENT_GENERATOR_UUID(uuid);
      this.SET_CURRENT_GENERATOR(resp);
      return resp;
    }
  }

  @Action({ rawError: true })
  async getGeneratorWorkloads(uuid: string) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new GetDatasetGeneratorWorkloads(uuid), {
      404: () => {}
    });
  }

  @Action({ rawError: true })
  async getWorkloadActivityLogs(uuid: string) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new GetDatasetGeneratorLogs(uuid), {
      504: () => {}
    });
  }

  @Action({ rawError: true })
  async generate(payload: { generator_uuid: string; payload: unknown }) {
    const api: Client = this.context.rootGetters.api,
      resp = await api.request(new RunDatasetGenerator(payload.generator_uuid, payload.payload));
    return resp ? resp.message : '';
  }

  @Action({ rawError: true })
  async deleteDatasetGenerator(dataset_generator: ShortDatasetGenerator) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new DeleteDatasetGenerator(dataset_generator.uuid));
  }

  @Action({ rawError: true })
  async updateDatasetGenerator(value?: DatasetGenerator) {
    const api: Client = this.context.rootGetters.api,
      dataset_generator = value ?? this.currentDatasetGenerator;

    if (this.currentDatasetGeneratorUUID && dataset_generator) {
      return await api.request(
        new UpdateDatasetGenerator(dataset_generator.uuid, dataset_generator)
      );
    }
  }

  @Action({ rawError: true })
  async addNewDatasetGenerator(value?: DatasetGenerator) {
    const api: Client = this.context.rootGetters.api,
      projectUUID = ProjectStore.activeProjectUUID,
      dataset_generator = value ?? this.currentDatasetGenerator;

    if (dataset_generator && projectUUID) {
      return await api.request(new AddDatasetGenerator(projectUUID, dataset_generator));
    }
  }

  @Action({ rawError: true })
  setCurrentDatasetGenerator(dataset_generator: DatasetGenerator) {
    this.SET_CURRENT_GENERATOR(dataset_generator);
  }

  @Action({ rawError: true })
  setCurrentDatasetGeneratorPolygon(polygon: GeoJSONPolygon) {
    const dataset_generator = cloneDeep(this.currentDatasetGenerator);
    if (dataset_generator) {
      dataset_generator.polygon = polygon;
      this.SET_CURRENT_GENERATOR(dataset_generator);
    }
  }

  @Action({ rawError: true })
  addGeneratorDataset(payload: {
    dataset: DatasetGeneratorDataset;
    parent_type: string;
    child_type: string;
  }) {
    const dataset = payload.dataset,
      parent_type = payload.parent_type,
      child_type = payload.child_type,
      dataset_generator = cloneDeep(this.currentDatasetGenerator);

    if (dataset_generator) {
      dataset_generator.datasets = addDataset(
        dataset_generator.datasets,
        dataset,
        parent_type,
        child_type
      );

      this.SET_CURRENT_GENERATOR(dataset_generator);
    }
  }

  @Action({ rawError: true })
  updateGeneratorDataset(dataset: DatasetGeneratorDataset) {
    const dataset_generator = cloneDeep(this.currentDatasetGenerator);
    if (dataset_generator) {
      dataset_generator.datasets = updateDataset(dataset_generator.datasets, dataset);
      this.SET_CURRENT_GENERATOR(dataset_generator);
    }
  }

  @Action({ rawError: true })
  removeGeneratorDataset(dataset_type: string) {
    const dataset_generator = cloneDeep(this.currentDatasetGenerator);
    if (dataset_generator) {
      dataset_generator.datasets = filterDatasets(dataset_generator.datasets, dataset_type);
      this.SET_CURRENT_GENERATOR(dataset_generator);
    }
  }

  @Action({ rawError: true })
  async cancelGeneration(generator_uuid: string) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new CancelDatasetGenerator(generator_uuid));
  }

  get datasetGenerators() {
    return this.dataset_generators;
  }

  get currentDatasetGenerator() {
    return this.current_dataset_generator;
  }

  get currentDatasetGeneratorUUID() {
    return this.current_dataset_generator_uuid;
  }

  get wmtsEndPoint() {
    return '/geoserver/gwc/service/wmts?';
  }
}

export default getModule(DatasetGeneratorsStore);
