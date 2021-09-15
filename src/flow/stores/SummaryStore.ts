import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { apiStore } from '@/store';
import { GetDatasetSummary, GetScenarioSummary } from '@/flow/requests';
import { DatasetSummary, UUID } from '@/flow/types';
import Client from '@/api/client';
@Module({
  name: 'summary',
  namespaced: true
})
class SummaryStore extends VuexModule {
  datasetSummaries: Record<UUID, DatasetSummary> = {};
  scenarioSummaries: Record<UUID, Record<UUID, DatasetSummary>> = {};
  currentScenarioUUID: string | null = null;
  client_: Client | null = null;

  get client() {
    return this.client_;
  }

  @Mutation
  SET_API_CLIENT(client: Client) {
    this.client_ = client;
  }

  @Mutation
  ADD_DATASET_SUMMARY(payload: {
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
  CLEAR_SUMMARIES() {
    this.datasetSummaries = {};
    this.scenarioSummaries = {};
  }

  @Mutation
  SET_SCENARIO(payload: { scenarioUUID: string | null }) {
    this.currentScenarioUUID = payload.scenarioUUID;
  }

  @Action({ rawError: true })
  setApiClient(client: Client) {
    this.SET_API_CLIENT(client);
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
    const { datasetUUID } = params;
    let { scenarioUUID } = params;

    scenarioUUID ??= this.currentScenarioUUID;

    let summary: DatasetSummary | null;
    summary = scenarioUUID
      ? this.scenarioSummaries[scenarioUUID]?.[datasetUUID]
      : this.datasetSummaries[datasetUUID];

    if (!summary) {
      summary = scenarioUUID
        ? await apiStore.client.request(new GetScenarioSummary(scenarioUUID, datasetUUID))
        : await apiStore.client.request(new GetDatasetSummary(datasetUUID));
      if (summary) {
        this.ADD_DATASET_SUMMARY({
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
    this.SET_SCENARIO(payload);
  }

  @Action({ rawError: true })
  clearSummaries() {
    this.CLEAR_SUMMARIES();
  }
}
export default SummaryStore;
