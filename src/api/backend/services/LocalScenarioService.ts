import Client from '@/flow/api/client';
import ScenarioService from '@/flow/api/backend/scenario';
import { Scenario, ShortScenario, SimulationMode, UUID } from '@/flow/types';

export default class LocalScenarioService implements ScenarioService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get(scenario_uuid: UUID) {
    return new Promise<Scenario>(resolve => {
      resolve(({
        uuid: '1',
        name: 'local_scenario',
        display_name: 'Local Scenario',
        version: 4,
        epsg_code: 28992,
        simulation_info: {
          mode: SimulationMode.TIME_ORIENTED,
          time_scale: 1,
          start_time: 0,
          duration: 86400,
          reference_time: 1513688161
        },
        description:
          'Test scenario for integration testing, contains small datasets and a few updates',
        models: [
          {
            name: 'mv_power_status',
            type: 'mv_power_status',
            default_connection_rules: {
              to_label: 'distribution'
            },
            output_charge_loss: 0.15,
            points: [
              ['antennas_test', 'antenna_entities'],
              ['poi_test', 'poi_entities']
            ],
            mv_networks: ['mv_network_test']
          },
          {
            name: 'mv_power_v2',
            type: 'mv_power_v2',
            mv_network: ['mv_network_test']
          },
          {
            name: 'flooding_netcdf_player',
            type: 'flooding_netcdf_player',
            flooding_netcdf: ['flooding_doorbraak_uitwateringssluis_subset_netcdf'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset']
          },
          {
            name: 'data_collector',
            type: 'data_collector',
            gather_filter: '*'
          },
          {
            name: 'flooding_effect_on_mv_network',
            type: 'flooded_powergrid_grounded_status',
            mv_network: ['mv_network_test'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            flooding_threshold: 0.3
          },
          {
            name: 'poi_computer',
            type: 'poi_flooding_status',
            pois: ['poi_test'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            flooding_threshold: 0.3
          },
          {
            name: 'road_status',
            type: 'flooded_road_availability_status',
            roads: ['roads_test'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            flooding_threshold: 0.3
          },
          {
            name: 'road_blockage',
            type: 'road_impact_model',
            limited_capacity_threshold: 0.8,
            road_impact: ['impact_indicator_test'],
            roads: ['roads_test'],
            no_capacity_threshold: 0.2
          },
          {
            name: 'evacuation',
            type: 'road_evacuation_routing_calculation',
            roads: ['roads_test']
          },
          {
            name: 'telecom_people_mapper',
            type: 'telecom_people_mapper_model',
            people: ['people_test'],
            antennas: ['antennas_test']
          },
          {
            name: 'telecom_impact',
            type: 'people_telecom_connectivity_impact',
            telecom_outage_impact: ['impact_indicator_test'],
            people: ['people_test']
          },
          {
            name: 'building_operational_status',
            type: 'building_operational_status',
            mv_network: ['mv_network_test'],
            publish_connections: false,
            roads: ['roads_test'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            buildings: ['buildings_test']
          },
          {
            name: 'electricity_outage_impact_indicators',
            type: 'electricity_outage_impact',
            mv_network: ['mv_network_test'],
            dso_costs: 0.75,
            nr_dso_clients: 2056362,
            mv_network_outage_impact: ['impact_indicator_test']
          },
          {
            name: 'flooding_impact_computer',
            type: 'building_flooding_impact',
            impact_indicator: ['impact_indicator_test'],
            flooding_threshold: 0.3,
            buildings: ['buildings_test']
          }
        ],
        datasets: [
          {
            name: 'impact_indicator_test',
            uuid: 'impact_indicator_test',
            type: 'impact_indicator'
          },
          {
            name: 'people_test',
            uuid: 'dc4ebaa8-4f0b-56b8-bc9e-5edcaef67251',
            type: 'people_point_set'
          },
          {
            name: 'antennas_test',
            uuid: '3078ba3f-5403-5869-a6d4-92e1cd64bc89',
            type: 'antenna_point_set'
          },
          {
            name: 'flooding_doorbraak_uitwateringssluis_subset_netcdf',
            uuid: '29aba8d3-5d40-57fa-a623-76cd3d8fc32f',
            type: 'flooding_tape'
          },
          {
            name: 'roads_test',
            uuid: 'c33685cf-471a-5834-bd12-e18d26143b94',
            type: 'road_line_set'
          },
          {
            name: 'poi_test',
            uuid: 'f00eb12b-48d8-5e9d-a426-df7f08b1160d',
            type: 'poi_point_set'
          },
          {
            name: 'mv_network_test',
            uuid: '5b7afeed-3302-5067-b1fc-da9637d2531b',
            type: 'mv_network'
          },
          {
            name: 'buildings_test',
            uuid: 'b6ab29f6-3b9c-5bc2-8ed0-07bb50543e72',
            type: 'building_polygon_set'
          },
          {
            name: 'dem_simci_denhaag',
            uuid: '7ed462f7-7011-464d-b583-6f69611a8d4f',
            type: 'height_map'
          },
          {
            name: 'flooding_doorbraak_uitwateringssluis_subset',
            uuid: '5b0f6106-4047-5e93-961c-b3177cfa35c5',
            type: 'flooding_grid'
          }
        ],
        created_on: 1574161245,
        last_modified: 1574244365,
        status: 'Succeeded'
      } as unknown) as Scenario);
    });
    // return await client?.request(new GetScenario(scenario_uuid));
  }

  list(project_uuid: UUID) {
    return new Promise<ShortScenario[]>(resolve => {
      resolve([
        {
          uuid: '1',
          name: 'local_scenario',
          project_name: 'local_project',
          display_name: 'Local Scenario'
        }
      ]);
    });
    // return (await client?.request(new GetScenarios(project_uuid))) ?? []
  }
}
