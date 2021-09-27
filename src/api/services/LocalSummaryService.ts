import Client from '@/flow/src/api/client';
import SummaryService from '@/flow/src/api/services/summary';
import { GetDatasetSummary, GetScenarioSummary } from '@/flow/src/api/requests';
import { DatasetSummary, UUID } from '@/flow/src/types';

export default class LocalSummaryService implements SummaryService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getScenario(scenario_uuid: UUID, dataset_uuid: UUID) {
    // return this.client.request(new GetScenarioSummary(scenario_uuid, dataset_uuid));
    return new Promise<DatasetSummary | null>(resolve =>
      resolve({
        count: 364,
        entity_groups: [
          {
            name: 'antenna_entities',
            count: 182,
            properties: [
              {
                component: '',
                name: 'id',
                data_type: 'INT',
                description: 'Identifier of the entity',
                unit: '',
                min_val: 0.0,
                max_val: 181.0
              },
              {
                component: 'antenna_properties',
                name: 'capacity',
                data_type: 'INT',
                description: 'Maximum number of people that can connect to the antenna',
                unit: '',
                min_val: 3000.0,
                max_val: 3000.0
              },
              {
                component: 'antenna_properties',
                name: 'connected_people',
                data_type: 'INT',
                description: 'Number of connected people',
                unit: '',
                min_val: 0.0,
                max_val: 3000.0
              },
              {
                component: 'antenna_properties',
                name: 'radius',
                data_type: 'DOUBLE',
                description: "Radius of the antenna's range",
                unit: 'm',
                min_val: 3000.0,
                max_val: 3000.0
              },
              {
                component: 'battery_properties',
                name: 'charge',
                data_type: 'DOUBLE',
                description: 'Battery charge percentage 0-1',
                unit: '',
                min_val: 0.0,
                max_val: 1.0
              },
              {
                component: 'battery_properties',
                name: 'max_life',
                data_type: 'DOUBLE',
                description: 'Max time before a battery depletes from full charge',
                unit: '',
                min_val: 9000.0,
                max_val: 9000.0
              },
              {
                component: 'battery_properties',
                name: 'power_source',
                data_type: 'INT',
                description:
                  'Power Status of the entity, reference to one of "electricity_net", "battery", "no_power"',
                unit: '',
                min_val: 0.0,
                max_val: 2.0
              },
              {
                component: 'operation_status_properties',
                name: 'has_power',
                data_type: 'BOOLEAN',
                description: 'Has power to operate',
                unit: '',
                min_val: 0.0,
                max_val: 1.0
              },
              {
                component: 'point_properties',
                name: 'position_x',
                data_type: 'DOUBLE',
                description: 'X coordinate',
                unit: 'm',
                min_val: 80178.0,
                max_val: 82228.0
              },
              {
                component: 'point_properties',
                name: 'position_y',
                data_type: 'DOUBLE',
                description: 'Y coordinate',
                unit: 'm',
                min_val: 454129.0,
                max_val: 455900.0
              },
              {
                component: 'point_properties',
                name: 'position_z',
                data_type: 'DOUBLE',
                description: 'Z coordinate',
                unit: 'm',
                min_val: -0.907,
                max_val: 4.494
              }
            ]
          },
          {
            name: 'connection_entities',
            count: 182,
            properties: [
              {
                component: '',
                name: 'id',
                data_type: 'INT',
                description: 'Identifier of the entity',
                unit: '',
                min_val: 182.0,
                max_val: 363.0
              },
              {
                component: 'connection_properties',
                name: 'from_id',
                data_type: 'INT',
                description:
                  'Reference from entity (in this dataset, or in from_dataset if defined)',
                unit: '',
                min_val: 0.0,
                max_val: 181.0
              },
              {
                component: 'connection_properties',
                name: 'to_dataset_type',
                data_type: 'STRING',
                description: 'Reference to the to_dataset type',
                unit: '',
                min_val: null,
                max_val: null
              },
              {
                component: 'connection_properties',
                name: 'to_label',
                data_type: 'INT',
                description: 'Reference to other data set label',
                unit: '',
                min_val: 0.0,
                max_val: 0.0
              }
            ]
          }
        ]
      })
    );
  }

  getDataset(dataset_uuid: UUID) {
    return new Promise<DatasetSummary>(resolve =>
      resolve({
        count: 1,
        entity_groups: [
          {
            name: 'area_entities',
            count: 1,
            properties: [
              {
                component: '',
                name: 'id',
                data_type: 'INT',
                description: 'Identifier of the entity',
                unit: '',
                min_val: 0.0,
                max_val: 0.0
              },
              {
                component: 'shape_properties',
                name: 'polygon',
                data_type: 'LIST<TUPLE<DOUBLE, DOUBLE>>',
                description: 'Polygon geometry of the flooding cell',
                unit: 'm',
                min_val: 80115.2820349674,
                max_val: 455937.90751026076
              }
            ]
          }
        ]
      })
    );
    // return this.client.request(new GetDatasetSummary(dataset_uuid));
  }
}
