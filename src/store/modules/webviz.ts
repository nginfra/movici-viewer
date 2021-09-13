import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import {
  CameraOptions,
  ColorRuleSet,
  Scenario,
  SimulationMode,
  TimeOrientedSimulationInfo,
  UUID,
  ViewConfig,
  VisualizationMode,
  VisualizationSettings
} from '@/types';
import Client from '@/api/client';
import {
  GetDatasets,
  GetDatasetSummary,
  GetGlobalColorRuleSet,
  GetScenario,
  GetScenarios,
  GetScenarioSummary
} from '@/api/requests';
import baseColorRuleSet from '@/visualizers/baseColorRuleSet';
import { mergeColorRuleSets } from '@/visualizers/maps/colorMaps';
import { determineEntityGeometry } from '@/visualizers/geometry';
import { getEntitySummary } from '@/utils';
import { VisualizerInfo } from '@/visualizers';
import { generalStore, projectStore, summaryStore } from '@/store/store';
@Module({
  name: 'webviz',
  namespaced: true
})
class WebvizStore extends VuexModule {
  settings: VisualizationSettings | null = null;
  scenario: Scenario | null = null;
  colorRuleSet: ColorRuleSet | null = null;

  @Mutation
  setSettings(settings: VisualizationSettings | null) {
    this.settings = settings;
  }
  @Mutation
  setScenario(scenario: Scenario | null) {
    this.scenario = scenario;
  }
  @Mutation
  setColorRuleSet(colorRuleSet: ColorRuleSet) {
    this.colorRuleSet = mergeColorRuleSets(baseColorRuleSet, colorRuleSet);
  }
  @Action({ rawError: true })
  async useSettings(settings: VisualizationSettings) {
    await this.context.dispatch('setActiveProjectName', settings.project.name, { root: true });

    const api: Client = generalStore.api;
    if (settings.mode === VisualizationMode.SCENARIO && settings.scenario) {
      this.setScenario(await api.request(new GetScenario(settings.scenario.uuid)));
      summaryStore.setCurrentScenario({ scenarioUUID: settings.scenario.uuid });
    } else {
      summaryStore.setCurrentScenario({ scenarioUUID: null });
      this.setScenario(null);
    }
    this.setSettings(settings);
  }

  @Action({ rawError: true })
  async parseViewConfig(
    view: ViewConfig
  ): Promise<{
    layerInfos: VisualizerInfo[];
    camera: CameraOptions;
    settings: VisualizationSettings;
    timestamp: number;
  }> {
    const api: Client = generalStore.api;
    await this.context.dispatch('getAllProjects', null, { root: true });
    const project = projectStore.getProjectByName(view.project_name);

    if (!project) {
      throw new Error('Project does not exist or user not authorized');
    }
    await this.context.dispatch('setActiveProjectName', view.project_name, { root: true });

    const scenarios = (await api.request(new GetScenarios(project.uuid))) || [];

    let scenarioUUID: UUID | null = null;
    for (const scenario of scenarios) {
      if (scenario.name == view.scenario_name) {
        scenarioUUID = scenario.uuid;
      }
    }

    if (!scenarioUUID) {
      throw new Error('Scenario does not exist in project or user not authorized');
    }

    const scenario = await api.request(new GetScenario(scenarioUUID));
    if (!scenario) {
      throw new Error('Error when fetching scenario');
    }

    const datasetMap: Record<string, UUID> = {};
    for (const dataset of scenario.datasets) {
      datasetMap[dataset.name] = dataset.uuid;
    }

    const layerInfos: VisualizerInfo[] = [];
    for (const layer of view.data_layers) {
      const info = VisualizerInfo.fromLayerConfig(layer, scenarioUUID);
      await finalizeLayerInfo(info, datasetMap);
      layerInfos.push(info);
    }
    const settings = {
      mode: VisualizationMode.SCENARIO,
      project: project,
      scenario: scenario
    };
    await this.context.dispatch('useSettings', settings);
    return { layerInfos, camera: view.camera, settings, timestamp: view.timestamp ?? 0 };
  }

  @Action({ rawError: true })
  async getDatasets() {
    const api: Client = generalStore.api,
      activeProjectUUID = projectStore.activeProjectUUID,
      allDatasets = (await api.request(new GetDatasets(activeProjectUUID))) ?? [];

    if (this.scenario) {
      const scenarioDatasets = new Set(this.scenario.datasets.map(d => d.uuid));
      return allDatasets.filter(d => scenarioDatasets.has(d.uuid));
    }
    return allDatasets;
  }

  @Action({ rawError: true })
  async getDatasetSummary(datasetUUID: string) {
    const api: Client = generalStore.api;
    if (this.mode && this.mode === VisualizationMode.SCENARIO && this.settings?.scenario) {
      return await api.request(new GetScenarioSummary(this.settings.scenario.uuid, datasetUUID));
    }
    return await api.request(new GetDatasetSummary(datasetUUID));
  }

  @Action({ rawError: true, commit: 'setColorRuleSet' })
  async getColorRuleSet() {
    const api: Client = generalStore.api;

    return await api.request(new GetGlobalColorRuleSet());
  }

  get mode(): VisualizationMode | null {
    return this.settings?.mode || null;
  }
  get timelineInfo(): TimeOrientedSimulationInfo | null {
    if (this.scenario?.simulation_info.mode === SimulationMode.TIME_ORIENTED) {
      return this.scenario.simulation_info;
    }
    return null;
  }
}

export async function finalizeLayerInfo(info: VisualizerInfo, datasetMap: Record<string, UUID>) {
  info.datasetUUID = datasetMap[info.datasetName] ?? null;
  if (info.datasetUUID) {
    const summary = await summaryStore.getDatasetSummary({
      scenarioUUID: info.scenarioUUID,
      datasetUUID: info.datasetUUID
    });
    if (!summary) {
      return;
    }
    const entitySummary = getEntitySummary(info.entityGroup, summary);
    if (!info.geometry && entitySummary) {
      info.geometry = determineEntityGeometry(entitySummary);
    }
  }

  info.mode = VisualizationMode.SCENARIO;
}

export default WebvizStore;
