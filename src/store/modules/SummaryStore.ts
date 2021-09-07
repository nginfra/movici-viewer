import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store/store';
import { GetDatasetSummary, GetScenarioSummary } from '@/api/requests';
import { DatasetSummary, UUID } from '@/types';
import Client from '@/api/client';
import GeneralStore from './GeneralStore';

@Module({
  name: 'summary',
  store,
  dynamic: true
})
class SummaryStore extends VuexModule {
  datasetSummaries: Record<UUID, DatasetSummary> = {};
  scenarioSummaries: Record<UUID, Record<UUID, DatasetSummary>> = {};
  currentScenarioUUID: string | null = null;

  @Mutation
  addDatasetSummary(payload: {
    datasetUUID: UUID;
    scenarioUUID?: UUID | null;
    summary: DatasetSummary;
  }) {
    if (payload.scenarioUUID) {
      this.scenarioSummaries[payload.scenarioUUID] ??= {};
      this.scenarioSummaries[payload.scenarioUUID][payload.datasetUUID] = payload.summary;
    } else {
      this.datasetSummaries[payload.datasetUUID] = payload.summary;
    }
  }

  @Mutation
  doClearSummaries() {
    this.datasetSummaries = {};
    this.scenarioSummaries = {};
  }
  @Mutation
  doSetScenario(payload: { scenarioUUID: string | null }) {
    this.currentScenarioUUID = payload.scenarioUUID;
  }

  /**
   * Get a Dataset Summary by `params.datasetUUUID`. When omitting `params.scenarioUUID` the summary
   * will be either  for the init data or, if the `SummaryStore` has a `currentScenarioUUID` defined,
   * for dataset in that scenario. Supplying a `params.scenarioUUID` will request the summary for
   * that scenario. If a `null` value is supplied for `params.scenarioUUID`, the summary is
   * requested for the init data, regardless of whether the `SummaryStore` is configured with a
   * `currentScenarioUUID`
   * @param params
   *   datasetUUID: the dataset UUID of the requested summary
   *   scenarioUUID: Optional scenario UUID to specify what (if any) scenario to request the
   *     dataset summary for. Omit this parameter to automatically determine the scenario (if any)
   */
  @Action({ rawError: true })
  async getDatasetSummary(params: {
    datasetUUID: string;
    scenarioUUID?: string | null;
  }): Promise<DatasetSummary | null> {
    const api: Client = GeneralStore.api;
    const datasetUUID = params.datasetUUID;
    const scenarioUUID =
      params.scenarioUUID === undefined ? this.currentScenarioUUID : params.scenarioUUID;

    let summary: DatasetSummary | null;
    summary = scenarioUUID
      ? this.scenarioSummaries[scenarioUUID]?.[datasetUUID]
      : this.datasetSummaries[datasetUUID];

    if (!summary) {
      summary = scenarioUUID
        ? await api.request(new GetScenarioSummary(scenarioUUID, datasetUUID))
        : await api.request(new GetDatasetSummary(datasetUUID));
      if (summary) {
        this.addDatasetSummary({
          datasetUUID,
          scenarioUUID,
          summary
        });
      }
    }

    return summary;
  }

  @Action({ rawError: true })
  setCurrentScenario(payload: { scenarioUUID: string | null }) {
    this.doSetScenario(payload);
  }

  @Action({ rawError: true })
  clearSummaries() {
    this.context.commit('doClearSummaries');
  }
}
export default getModule(SummaryStore);
