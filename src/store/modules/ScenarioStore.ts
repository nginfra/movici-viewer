import Vue from 'vue';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { downloadAsFile } from '@/store/requests';
import store from '@/store/store';
import { Scenario, ShortScenario, Simulation, UUID } from '@/types';
import {
  AddScenario,
  DeleteScenario,
  DeleteSimulation,
  DeleteTimeline,
  GetAnalysisPlot,
  GetAnalysisTemplates,
  GetScenario,
  GetScenarios,
  GetSimulation,
  GetSimulationLogs,
  GetSimulations,
  RunSimulation,
  UpdateScenario
} from '@/api/requests';
import Client from '@/api/client';
import { getStatusFromScenarioAndSimulation } from '@/utils';
import ProjectStore from './ProjectStore';
import GeneralStore from './GeneralStore';

@Module({
  name: 'scenarios', // TODO: rename to 'scenario' once everything is converted to ts
  namespaced: true,
  dynamic: true,
  store: store
})
class ScenarioStore extends VuexModule {
  scenarios: ShortScenario[] = [];
  currentScenario: Scenario | ShortScenario | null = null;
  currentScenarioUUID: string | null = null;
  currentScenarioHasSimulation = false;
  currentSimulation: Simulation | null = null;

  @Mutation
  SET_SCENARIOS(scenarios: ShortScenario[]) {
    this.scenarios = scenarios;
  }

  @Mutation
  SET_CURRENT_SCENARIO(scenario: Scenario | null) {
    this.currentScenario = scenario;
  }

  @Mutation
  SET_CURRENT_SCENARIO_UUID(uuid: string) {
    this.currentScenarioUUID = uuid;
  }

  @Mutation
  SET_CURRENT_SCENARIO_SIMULATION_STATE(payload: boolean) {
    this.currentScenarioHasSimulation = payload;
  }

  @Mutation
  SET_CURRENT_SIMULATION(payload: Simulation | null) {
    this.currentSimulation = payload;
  }

  @Action({ rawError: true })
  async getScenariosWithSimulationInfo(projectUUID?: UUID) {
    projectUUID ??= ProjectStore.activeProjectUUID;

    if (projectUUID) {
      const api: Client = GeneralStore.api,
        [scenarios, simulations] = await Promise.all([
          api.request(new GetScenarios(projectUUID)),
          api.request(new GetSimulations(projectUUID))
        ]);

      scenarios?.length &&
        scenarios.forEach(scenario => {
          // Use Vue.set to ensure that the new property is a reactive Vue property
          simulations?.length &&
            simulations.forEach(simulation => {
              if (simulation.scenario_uuid === scenario.uuid) {
                const status = getStatusFromScenarioAndSimulation(scenario, simulation);
                Vue.set(scenario, 'status', status);
                scenario.has_simulation = true;
              }
            });
        });

      this.SET_SCENARIOS(scenarios ?? []);
      return scenarios;
    }

    this.SET_SCENARIOS([]);
    return [];
  }

  @Action({ rawError: true })
  async getScenario(uuid: string) {
    const api: Client = GeneralStore.api;

    this.SET_CURRENT_SIMULATION(null);

    const [scenario] = await Promise.all([
      api.request(new GetScenario(uuid)),
      this.getSimulation(uuid)
    ]);
    if (!scenario) {
      throw new Error('Could not find scenario for uuid  ' + uuid);
    }

    this.SET_CURRENT_SCENARIO(scenario);
    this.SET_CURRENT_SCENARIO_UUID(uuid);

    return scenario;
  }

  @Action({ rawError: true })
  async addScenario(payload: { scenario?: Scenario; projectUUID?: UUID }) {
    let { scenario, projectUUID } = payload;

    projectUUID ??= ProjectStore.activeProjectUUID;
    scenario ??= this.currentScenario as Scenario;

    const { rootGetters } = this.context;
    if (scenario && projectUUID) {
      return await rootGetters.api.request(new AddScenario(projectUUID, scenario as Scenario));
    }
  }

  @Action({ rawError: true })
  async updateScenario() {
    const { rootGetters } = this.context;
    if (this.currentScenarioUUID && this.currentScenario) {
      return await rootGetters.api.request(
        new UpdateScenario(this.currentScenarioUUID, this.currentScenario as Scenario)
      );
    }
  }

  @Action({ rawError: true })
  async deleteScenario(scenario: ShortScenario) {
    const { rootGetters } = this.context;
    const api: Client = rootGetters.api;
    const [resp] = await Promise.all([
      api.request(new DeleteScenario(scenario.uuid)),
      api.request(new DeleteSimulation(scenario.uuid), {
        404: () => {}
      })
    ]);

    return resp;
  }

  @Action({ rawError: true })
  setCurrentScenario(scenario: Scenario | ShortScenario) {
    this.SET_CURRENT_SCENARIO(scenario as Scenario);
  }

  @Action({ rawError: true })
  async getSimulation(uuid: string) {
    const api: Client = GeneralStore.api;

    const simulation = await api.request(new GetSimulation(uuid), {
      404: () => {}
    });

    if (simulation && simulation.scenario_uuid === uuid) {
      this.SET_CURRENT_SCENARIO_SIMULATION_STATE(true);
      this.SET_CURRENT_SIMULATION(simulation);
    }

    return simulation;
  }

  @Action({ rawError: true })
  clearScenario(scenario: ShortScenario) {
    const api: Client = GeneralStore.api;
    const promises = [
      api.request(new DeleteTimeline(scenario.uuid), {
        404: () => {}
      }),
      api.request(new DeleteSimulation(scenario.uuid), {
        404: () => {}
      })
    ];
    return Promise.all(promises);
  }

  @Action({ rawError: true })
  async runScenario(scenario: ShortScenario) {
    const api: Client = GeneralStore.api;
    return await api.request(new RunSimulation(scenario.uuid));
  }

  @Action({ rawError: true })
  async getLogs(scenarioUUID: string) {
    const api: Client = GeneralStore.api;

    return await api.request(new GetSimulationLogs(scenarioUUID), {
      404: () => {}
    });
  }

  @Action({ rawError: true })
  async downloadLogs(scenario: ShortScenario) {
    const api: Client = GeneralStore.api;

    const resp = await api.request(new GetSimulationLogs(scenario.uuid), {
      404: () => {}
    });

    if (resp) {
      downloadAsFile(new Blob([resp]), `${scenario.name}_log.txt`);
    }
  }

  @Action({ rawError: true })
  async getAnalysisPlot(payload: { scenario_uuid: string; config: Record<string, unknown> }) {
    const api: Client = GeneralStore.api;

    const resp = await api.request(new GetAnalysisPlot(payload.scenario_uuid, payload.config));

    if (!resp) {
      return null;
    }

    const image = btoa(
      new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return `data:${resp.contentType.toLowerCase()};base64,${image}`;
  }

  @Action({ rawError: true })
  async getAnalysisTemplates() {
    const api: Client = GeneralStore.api;
    const templates = await api.request(new GetAnalysisTemplates());

    if (!templates) {
      return [];
    }
    return templates;
  }
}

export default getModule(ScenarioStore);
