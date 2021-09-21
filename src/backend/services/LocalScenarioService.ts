import Client from '@/api/client';
import ScenarioService from '@/flow/backend/scenario';
import { Scenario, SimulationMode, UUID } from '@/flow/types';

export default class LocalScenarioService implements ScenarioService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(scenario_uuid: UUID) {
    return new Promise<Scenario>(resolve => {
      resolve({
        uuid: '1',
        name: 'local_scenario',
        project_name: 'local_project',
        display_name: 'Local Scenario',
        has_simulation: false,
        datasets: [],
        simulation_info: {
          mode: SimulationMode.TIME_ORIENTED,
          start_time: 0,
          reference_time: 0,
          duration: 0,
          time_scale: 0
        }
      });
    });
    // return await client?.request(new GetScenario(activeScenarioUUID));
  }

  list(project_uuid: UUID) {
    return new Promise<Scenario[]>(resolve => {
      resolve([
        {
          uuid: '1',
          name: 'local_scenario',
          project_name: 'local_project',
          display_name: 'Local Scenario',
          has_simulation: false,
          datasets: [],
          simulation_info: {
            mode: SimulationMode.TIME_ORIENTED,
            start_time: 0,
            reference_time: 0,
            duration: 0,
            time_scale: 0
          }
        }
      ]);
    });
    // return (await client?.request(new GetScenarios(activeProjectUUID))) ?? []
  }
}
