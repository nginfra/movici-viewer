import Client from '@/flow/api/client';
import ViewService from '@/flow/api/services/view';
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
          name: 'Local Test',
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
                name: 'Antennas',
                visible: true,
                settings: {
                  size: { static: { size: 2, units: 'pixels' } },
                  type: 'points',
                  color: {
                    legend: { title: 'Has power?', labels: ['False', 'True'] },
                    byValue: {
                      type: 'buckets',
                      colors: [
                        [0, [207, 89, 126]],
                        [1, [0, 147, 146]]
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

  // for local we can setup save files for views
  async update(viewUUID: UUID, view: View) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new UpdateView(viewUUID, view));
  }

  async delete(viewUUID: UUID) {
    return new Promise<void>(resolve => resolve());
    // return await client?.request(new DeleteView(viewUUID));
  }
}
