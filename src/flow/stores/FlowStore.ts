import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import {
  Dataset,
  FlowStoreConfig,
  Project,
  Scenario,
  ShortScenario,
  SimulationMode,
  TimeOrientedSimulationInfo,
  UUID,
  View
} from '@/flow/types';
import { ComposableVisualizerInfo } from '@/flow/visualizers/VisualizerInfo';
import {
  AddView,
  DeleteView,
  GetDatasets,
  GetProjects,
  GetScenario,
  GetScenarios,
  GetView,
  GetViews,
  UpdateView
} from '@/flow/requests';
import { exportFromConfig } from '@/flow/utils/DataExporter';
import { summaryStore, flowUIStore } from '@/store';
import Client from '@/api/client'; // might need a interface class inside flow for this?

@Module({
  name: 'flow',
  namespaced: true
})
class FlowStore extends VuexModule {
  visualizers: ComposableVisualizerInfo[] = [];
  view: View | null = null;
  views: View[] = [];
  project: Project | null = null;
  projects: Project[] = [];
  scenarios: ShortScenario[] = [];
  scenario: Scenario | null = null;
  timestamp = 0;
  client_: Client | null = null;

  get hasProject(): boolean {
    return !!this.project;
  }

  get hasScenario(): boolean {
    return !!this.scenario;
  }

  // TODO: try to use router link options to do this
  get queryString() {
    const params: Record<string, string | undefined> = {
      project: this.project?.name,
      scenario: this.scenario?.name
    };

    return Object.keys(params)
      .filter((key: string) => params[key])
      .map((key: string) => key + '=' + params[key])
      .join('&');
  }

  get timelineInfo(): TimeOrientedSimulationInfo | null {
    if (this.scenario?.simulation_info.mode === SimulationMode.TIME_ORIENTED) {
      return this.scenario.simulation_info;
    }
    return null;
  }

  get client() {
    return this.client_;
  }

  @Mutation
  UPDATE_VISUALIZERS(visualizers: ComposableVisualizerInfo[]) {
    this.visualizers = visualizers;
  }

  @Mutation
  SET_PROJECTS(projects: Project[]) {
    this.projects = projects;
  }

  @Mutation
  SET_CURRENT_PROJECT(project: Project | null) {
    this.project = project;
  }

  @Mutation
  SET_CURRENT_SCENARIO(scenario: Scenario | null) {
    this.scenario = scenario;
  }

  @Mutation
  SET_SCENARIOS(scenarios: ShortScenario[]) {
    this.scenarios = scenarios;
  }

  @Mutation
  UPDATE_VIEW(view: View | null) {
    this.view = view;
  }

  @Mutation
  SET_VIEWS(views: View[]) {
    this.views = views;
  }

  @Mutation
  SET_TIMESTAMP(timestamp: number) {
    this.timestamp = timestamp;
  }

  @Mutation
  SET_API_CLIENT(client: Client) {
    this.client_ = client;
  }

  @Action({ rawError: true })
  updateCurrentView(view: View | null) {
    this.UPDATE_VIEW(view);
  }

  @Action({ rawError: true })
  updateVisualizers(visualizers: ComposableVisualizerInfo[]) {
    this.UPDATE_VISUALIZERS(visualizers);
  }

  @Action({ rawError: true })
  async getProjects() {
    const projects = (await this.client?.request(new GetProjects())) ?? [];
    this.SET_PROJECTS(projects);
  }

  @Action({ rawError: true })
  async setCurrentFlowProject(project: Project) {
    this.SET_CURRENT_PROJECT(project);
    flowUIStore.enableSection({
      datasets: true,
      scenario: true
    });
  }

  @Action({ rawError: true })
  setApiClient(client: Client) {
    this.SET_API_CLIENT(client);
  }

  @Action({ rawError: true })
  async setCurrentFlowScenario(scenario: Scenario) {
    flowUIStore.enableSection({ visualization: true, export: true });
    summaryStore.setCurrentScenario({ scenarioUUID: scenario.uuid });

    this.SET_CURRENT_SCENARIO(scenario);
    flowUIStore.enableSection({ visualization: !!scenario });
    flowUIStore.enableSection({ export: !!scenario });
    if (scenario) {
      summaryStore.setCurrentScenario({ scenarioUUID: scenario.uuid });
      await this.getViewsByScenario(scenario.uuid);
    }
  }

  @Action({ rawError: true })
  async getDatasets(projectUUID: UUID): Promise<Dataset[] | null> {
    const activeProjectUUID = this.project?.uuid || projectUUID,
      datasets = activeProjectUUID
        ? (await this.client?.request(new GetDatasets(activeProjectUUID))) ?? []
        : [];

    return datasets;
  }

  @Action({ rawError: true })
  async getScenariosByProject(projectUUID?: UUID) {
    const activeProjectUUID = projectUUID ?? this.project?.uuid,
      scenarios: ShortScenario[] = activeProjectUUID
        ? (await this.client?.request(new GetScenarios(activeProjectUUID))) ?? []
        : [];

    this.SET_SCENARIOS(scenarios);
    return scenarios;
  }

  @Action({ rawError: true })
  async getViewsByScenario(scenarioUUID?: string): Promise<View[]> {
    const currentScenarioUUID = scenarioUUID ?? this.scenario?.uuid;
    if (currentScenarioUUID) {
      const views = (await this.client?.request(new GetViews(currentScenarioUUID))) ?? [];
      this.SET_VIEWS(views);
      return views;
    }

    return [];
  }

  @Action({ rawError: true })
  async getScenario(activeScenarioUUID: UUID) {
    if (activeScenarioUUID) {
      return await this.client?.request(new GetScenario(activeScenarioUUID));
    }
    return null;
  }

  @Action({ rawError: true })
  setTimestamp(value: number) {
    this.SET_TIMESTAMP(value);
  }

  @Action({ rawError: true })
  async exportFromConfig(payload: {
    datasetName: string;
    entityGroup: string;
    timestamp?: number;
  }) {
    flowUIStore.setLoading({ value: true, msg: 'Exporting data...' });

    const datasets = (await this.getDatasets(this.project?.uuid ?? '<unknown project>'))?.reduce<
      Record<string, Dataset>
    >((obj, curr) => {
      obj[curr.name] = curr;
      return obj;
    }, {});

    if (datasets && this.project && this.scenario && this.timelineInfo && this.client) {
      await exportFromConfig({
        config: {
          dataset: datasets[payload.datasetName] ?? null,
          projectName: this.project?.display_name,
          scenario: this.scenario,
          entityName: payload.entityGroup,
          timestamp: payload.timestamp ?? this.timestamp
        },
        timelineInfo: this.timelineInfo,
        api: this.client
      });
    }

    flowUIStore.setLoading({ value: false });
  }

  @Action({ rawError: true })
  async resetFlowStore() {
    // SummaryStore.setCurrentScenario({ scenarioUUID: null });
    this.SET_PROJECTS([]);
    this.SET_CURRENT_PROJECT(null);
    this.SET_SCENARIOS([]);
    this.SET_CURRENT_SCENARIO(null);
    this.SET_TIMESTAMP(0);
    this.UPDATE_VISUALIZERS([]);
  }

  @Action({ rawError: true })
  async createView({ scenarioUUID, view }: { scenarioUUID: UUID; view: View }) {
    return await this.client?.request(new AddView(scenarioUUID, view));
  }

  @Action({ rawError: true })
  async getViews(scenarioUUID: UUID): Promise<View[]> {
    return (await this.client?.request(new GetViews(scenarioUUID))) ?? [];
  }

  @Action({ rawError: true })
  async getView(viewUUID: UUID) {
    return await this.client?.request(new GetView(viewUUID));
  }

  @Action({ rawError: true })
  async updateView({ viewUUID, view }: { viewUUID: UUID; view: View }) {
    return await this.client?.request(new UpdateView(viewUUID, view));
  }

  @Action({ rawError: true })
  async deleteView(viewUUID: UUID) {
    return await this.client?.request(new DeleteView(viewUUID));
  }

  /**
   * This function sets up the start of the flow, depending on the configuration.
   * The user can start the flow on different sections, each has a different config that is validated here.
   * If config is valid, we query the resources and set them up in the store so they're accessible in the component
   *
   * @param config
   */
  @Action({ rawError: true })
  async setupFlowStore({ config, reset = true }: { config: FlowStoreConfig; reset?: boolean }) {
    if (reset) {
      this.resetFlowStore();
    }

    const {
      currentProjectName,
      currentScenarioName,
      getProject = false,
      getScenario = false,
      disableCollapser = false
    } = config;

    // needs a project but doesn't provide project name
    if (getProject && !currentProjectName) {
      throw new Error('Project name not provided');
    }

    // project is not set and provides a project name
    if (!this.project && currentProjectName) {
      const currentProject = this.projects.find((p: Project) => p.name === currentProjectName);

      if (currentProject?.uuid) {
        await this.setCurrentFlowProject(currentProject);
      } else {
        // project name is invalid
        this.resetFlowStore();

        throw new Error('Invalid project');
      }
    }

    // has a project (either previously set on the store, or by last if and needs the scenario)
    // needs a scenario and provided a scenario name
    if (this.project && getScenario) {
      const scenarios = (await this.getScenariosByProject(this.project.uuid)) || [];

      if (currentScenarioName) {
        const shortScenario = scenarios.find(p => p.name === currentScenarioName);

        if (shortScenario) {
          const scenario = await this.getScenario(shortScenario.uuid);

          // full scenario not found
          if (scenario) {
            await this.setCurrentFlowScenario(scenario);
          } else {
            this.resetFlowStore();

            throw new Error('Invalid full scenario');
          }
        } else {
          // scenario name is invalid
          this.resetFlowStore();

          throw new Error('Invalid short Scenario');
        }
      }
    }

    flowUIStore.enableSection({
      datasets: this.hasProject,
      scenario: this.hasProject,
      visualization: this.hasScenario,
      export: this.hasScenario
    });

    flowUIStore.setDisableCollapser(disableCollapser);
  }
}

export default FlowStore;
