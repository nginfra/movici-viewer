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
        uuid: 'b39c3fb6-86e2-4650-a582-93de2537cae8',
        name: 'test_integration_scenario',
        project_name: 'test_project',
        display_name: 'Test integration scenario',
        version: 4,
        epsg_code: 28992,
        bounding_box: [79117.558, 453164.2819, 83182.08864, 456935.9222],
        simulation_info: {
          mode: 'time_oriented',
          start_time: 0,
          time_scale: 1,
          reference_time: 1513688161,
          duration: 86400
        },
        description:
          'Test scenario for integration testing, contains small datasets and a few updates',
        models: [
          {
            name: 'flooding_impact_computer',
            type: 'building_flooding_impact',
            impact_indicator: ['impact_indicator_test'],
            buildings: ['building_height'],
            flooding_threshold: 0.3
          },
          {
            name: 'building_operational_status',
            type: 'building_operational_status',
            publish_connections: false,
            mv_network: ['mv_network_test'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            roads: ['roads_test'],
            buildings: ['building_height']
          },
          { name: 'data_collector', type: 'data_collector', gather_filter: '*' },
          {
            name: 'electricity_outage_impact_indicators',
            type: 'electricity_outage_impact',
            mv_network: ['mv_network_test'],
            dso_costs: 0.75,
            nr_dso_clients: 2056362,
            mv_network_outage_impact: ['impact_indicator_test']
          },
          {
            name: 'flooding_effect_on_mv_network',
            type: 'flooded_powergrid_grounded_status',
            mv_network: ['mv_network_test'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            flooding_threshold: 0.3
          },
          {
            name: 'road_status',
            type: 'flooded_road_availability_status',
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            roads: ['roads_test'],
            flooding_threshold: 0.3
          },
          {
            name: 'flooding_netcdf_player',
            type: 'flooding_netcdf_player',
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            flooding_netcdf: ['flooding_doorbraak_uitwateringssluis_subset_netcdf']
          },
          {
            name: 'mv_power_status',
            type: 'mv_power_status',
            output_charge_loss: 0.15,
            default_connection_rules: { to_label: 'distribution' },
            points: [
              ['antennas_test', 'antenna_entities'],
              ['poi_test', 'poi_entities']
            ],
            mv_networks: ['mv_network_test']
          },
          { name: 'mv_power_v2', type: 'mv_power_v2', mv_network: ['mv_network_test'] },
          {
            name: 'telecom_impact',
            type: 'people_telecom_connectivity_impact',
            telecom_outage_impact: ['impact_indicator_test'],
            people: ['people_test']
          },
          {
            name: 'poi_computer',
            type: 'poi_flooding_status',
            pois: ['poi_test'],
            flooding_grid: ['flooding_doorbraak_uitwateringssluis_subset'],
            flooding_threshold: 0.3
          },
          {
            name: 'evacuation',
            type: 'road_evacuation_routing_calculation',
            roads: ['roads_test']
          },
          {
            name: 'road_blockage',
            type: 'road_impact_model',
            limited_capacity_threshold: 0.8,
            no_capacity_threshold: 0.2,
            road_impact: ['impact_indicator_test'],
            roads: ['roads_test']
          },
          {
            name: 'telecom_people_mapper',
            type: 'telecom_people_mapper_model',
            people: ['people_test'],
            antennas: ['antennas_test']
          }
        ],
        datasets: [
          {
            name: 'antennas_test',
            uuid: 'e12c43eb-93e8-453a-b573-5fadaffe8a90',
            type: 'antenna_point_set'
          },
          {
            name: 'building_height',
            uuid: 'a0fdc09c-a172-4862-9a4f-309c79c6d16f',
            type: 'building_polygon_set'
          },
          {
            name: 'dem_simci_denhaag',
            uuid: '2642ac5b-9518-411f-b8c3-2f44785ee794',
            type: 'height_map'
          },
          {
            name: 'flooding_doorbraak_uitwateringssluis_subset',
            uuid: '8366bdcd-7ec8-41f4-a3e8-b4919be968a5',
            type: 'flooding_grid'
          },
          {
            name: 'flooding_doorbraak_uitwateringssluis_subset_netcdf',
            uuid: 'fb4ee3d3-2332-4742-90d8-77680a8cf4d6',
            type: 'flooding_tape'
          },
          {
            name: 'impact_indicator_test',
            uuid: '842512e6-b016-40d2-9b9a-87e0625a0835',
            type: 'impact_indicator'
          },
          {
            name: 'mv_network_test',
            uuid: 'ed25f110-a370-488f-92ad-0674c83c0d94',
            type: 'mv_network'
          },
          {
            name: 'people_test',
            uuid: '139829a0-f8f7-4d56-8da6-f35dce15ed50',
            type: 'people_point_set'
          },
          { name: 'poi_test', uuid: '5fefb50a-b132-4848-80ce-758ae7af9d06', type: 'poi_point_set' },
          {
            name: 'roads_test',
            uuid: '59270292-6dbd-4884-a400-c064bb6b2862',
            type: 'road_line_set'
          }
        ],
        created_on: 1598965549,
        last_modified: 1598965549,
        has_timeline: true,
        status: 'Succeeded'
      } as unknown) as Scenario);
    });
    // return await client?.request(new GetScenario(scenario_uuid));
  }

  list(project_uuid: UUID) {
    return new Promise<ShortScenario[]>(resolve => {
      resolve([
        {
          uuid: 'f20466ab-9bb8-4db1-959d-a9fc9106ff2b',
          name: 'test_scenario',
          display_name: 'Test scenario',
          created_on: 1598965551,
          project_name: 'test_project',
          status: 'Succeeded',
          has_timeline: true
        },
        {
          uuid: 'b39c3fb6-86e2-4650-a582-93de2537cae8',
          name: 'test_integration_scenario',
          display_name: 'Test integration scenario',
          created_on: 1598965549,
          project_name: 'test_project',
          status: 'Succeeded',
          has_timeline: true
        }
      ]);
    });
    // return (await client?.request(new GetScenarios(project_uuid))) ?? []
  }
}
