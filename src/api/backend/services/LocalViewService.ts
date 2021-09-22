import Client from '@/flow/api/client';
import ViewService from '@/flow/api/backend/view';
import { UUID, View } from '@/flow/types';

export default class LocalViewService implements ViewService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async create(scenarioUUID: UUID, view: View) {
    return { view_uuid: '1234' };
  }

  async list(scenarioUUID: UUID): Promise<View[]> {
    // get sample views
    return new Promise<View[]>(resolve =>
      resolve(([
        {
          uuid: 'dc749e4c-3e47-410f-9d96-6bcd674d12b2',
          name: 'Untitled',
          scenario_uuid: 'b39c3fb6-86e2-4650-a582-93de2537cae8',
          config: {
            camera: {
              zoom: 13.045458670492817,
              pitch: 0,
              bearing: 0,
              latitude: 52.07204623764498,
              longitude: 4.314636096676621
            },
            version: 1,
            timestamp: 0,
            visualizers: [
              {
                name: 'ASD',
                visible: true,
                settings: {
                  size: { static: { size: 2, units: 'pixels' } },
                  type: 'points',
                  color: {
                    legend: { title: '', labels: ['0 - 1', '1 - 1'] },
                    byValue: {
                      type: 'buckets',
                      colors: [
                        [0, [0, 147, 146]],
                        [1, [207, 89, 126]]
                      ],
                      maxValue: 1,
                      attribute: {
                        name: 'has_power',
                        unit: '',
                        max_val: 1,
                        min_val: 0,
                        component: 'operation_status_properties',
                        data_type: 'BOOLEAN',
                        description: 'Has power to operate'
                      },
                      specialColor: [255, 255, 255],
                      undefinedColor: [0, 0, 0]
                    }
                  }
                },
                dataset_name: 'antennas_test',
                entity_group: 'antenna_entities'
              },
              {
                name: 'electrical_cable_entities',
                visible: true,
                settings: {
                  size: { static: { size: 2, units: 'pixels' } },
                  type: 'lines',
                  color: {
                    legend: {
                      title: '',
                      labels: ['3990', '2640183.25', '5276376.5', '7912569.75']
                    },
                    byValue: {
                      type: 'gradient',
                      colors: [
                        [10737840, [243, 231, 155]],
                        [10753807.333, [248, 160, 126]],
                        [10769774.667, [206, 102, 147]],
                        [10785742, [92, 83, 165]]
                      ],
                      maxValue: 10785742,
                      attribute: {
                        name: 'id',
                        unit: '',
                        max_val: 10785742,
                        min_val: 10737840,
                        component: '',
                        data_type: 'INT',
                        description: 'Identifier of the entity'
                      },
                      specialColor: [255, 255, 255],
                      undefinedColor: [0, 0, 0]
                    }
                  }
                },
                dataset_name: 'mv_network_test',
                entity_group: 'electrical_cable_entities'
              }
            ]
          }
        }
      ] as unknown) as View[])
    );
    // return (await client?.request(new GetViews(scenarioUUID))) ?? [];
  }

  async get(viewUUID: UUID) {
    return new Promise<View>(
      resolve =>
        viewUUID &&
        resolve({
          name: 'Local View',
          config: {
            version: 1,
            visualizers: []
          }
        })
    ); // get sample view
    // return await client?.request(new GetView(viewUUID));
  }

  async update(viewUUID: UUID, view: View) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new UpdateView(viewUUID, view));
  }

  async delete(viewUUID: UUID) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new DeleteView(viewUUID));
  }
}
