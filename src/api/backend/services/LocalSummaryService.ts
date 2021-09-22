import Client from '@/flow/api/client';
import SummaryService from '@/flow/api/backend/summary';
import { GetDatasetSummary, GetScenarioSummary } from '@/flow/requests';
import { DatasetSummary, UUID } from '@/flow/types';

export default class LocalSummaryService implements SummaryService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getScenario(scenario_uuid: UUID, dataset_uuid: UUID) {
    return this.client.request(new GetScenarioSummary(scenario_uuid, dataset_uuid));
    // return new Promise<DatasetSummary | null>(resolve => resolve(null));
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
