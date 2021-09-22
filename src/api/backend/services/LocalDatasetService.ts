import Client from '@/flow/api/client';
import DatasetService from '@/flow/api/backend/dataset';
import { GetDatasetData, GetScenarioState } from '@/flow/requests';
import { ComponentProperty, Dataset, DatasetWithData, UUID } from '@/flow/types';
import { NumberSizeMap } from '@/flow/visualizers/maps/sizeMaps';

export default class LocalDatasetService implements DatasetService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async list(project_uuid: string) {
    return new Promise<Dataset[]>(resolve => {
      resolve([
        {
          uuid: '842512e6-b016-40d2-9b9a-87e0625a0835',
          name: 'impact_indicator_test',
          type: 'impact_indicator',
          display_name: 'Impact Indicator',
          created_on: 1598965490,
          last_modified: 1598965491,
          has_data: true,
          status: 'Done'
        },
        {
          uuid: '139829a0-f8f7-4d56-8da6-f35dce15ed50',
          name: 'people_test',
          type: 'people_point_set',
          display_name: 'People',
          created_on: 1598965493,
          last_modified: 1598965493,
          has_data: true,
          status: 'Done'
        },
        {
          uuid: '59270292-6dbd-4884-a400-c064bb6b2862',
          name: 'roads_test',
          type: 'road_line_set',
          display_name: 'Roads',
          created_on: 1598965524,
          last_modified: 1598965525,
          has_data: true,
          status: 'Done'
        },
        {
          uuid: '5fefb50a-b132-4848-80ce-758ae7af9d06',
          name: 'poi_test',
          type: 'poi_point_set',
          display_name: 'POI',
          created_on: 1598965525,
          last_modified: 1598965526,
          has_data: true,
          status: 'Done'
        },
        {
          uuid: 'ed25f110-a370-488f-92ad-0674c83c0d94',
          name: 'mv_network_test',
          type: 'mv_network',
          display_name: 'MV Network',
          created_on: 1598965526,
          last_modified: 1598965527,
          has_data: true,
          status: 'Done'
        },
        {
          uuid: '8366bdcd-7ec8-41f4-a3e8-b4919be968a5',
          name: 'flooding_doorbraak_uitwateringssluis_subset',
          type: 'flooding_grid',
          display_name: 'Flooding',
          created_on: 1598965547,
          last_modified: 1598965548,
          has_data: true,
          status: 'Done'
        },
        {
          uuid: 'e12c43eb-93e8-453a-b573-5fadaffe8a90',
          name: 'antennas_test',
          type: 'antenna_point_set',
          display_name: 'Antennas',
          created_on: 1598965496,
          last_modified: 1623232097,
          has_data: true,
          status: 'Done'
        },
        {
          uuid: 'a0fdc09c-a172-4862-9a4f-309c79c6d16f',
          name: 'building_height',
          type: 'building_polygon_set',
          display_name: 'Buildings',
          created_on: 1601453516,
          last_modified: 1601453607,
          has_data: true,
          status: 'Done'
        }
      ]);
    });
    // return (await this.client?.request(new GetDatasets(project_uuid))) ?? [];
  }

  async getData<T>(params: {
    datasetUUID: UUID;
    entityGroup?: string;
    properties?: ComponentProperty[];
  }): Promise<DatasetWithData<T> | null> {
    // const { datasetUUID, entityGroup, properties } = params;
    // return await this.client.request(new GetDatasetData<T>(datasetUUID, entityGroup, properties));
    return new Promise<DatasetWithData<T>>(resolve => {
      resolve(({
        created_on: 1598965490,
        data: {
          area_entities: {
            id: [0],
            shape_properties: {
              polygon: [
                [
                  [81573.06237012024, 455812.32079432247],
                  [81443.08269235707, 455726.20793061104],
                  [81424.23554428895, 455744.82687384414],
                  [81315.3024882778, 455937.90751026076],
                  [80821.51310442756, 455646.3006948875],
                  [80796.51184818358, 455646.67347535206],
                  [80551.57006470606, 455497.73531359015],
                  [80723.6974262153, 455203.1617094328],
                  [80115.2820349674, 454805.0629215504],
                  [80264.07093512437, 454523.9920995374],
                  [80300.31730040238, 454488.225698762],
                  [80364.71150402902, 454465.2456364487],
                  [80502.0635758143, 454204.8827491718],
                  [80542.96872320975, 454185.1908251309],
                  [80884.22648108884, 454375.2961249861],
                  [81000.3266143803, 454168.09679095255],
                  [81015.653199849, 454159.7966829858],
                  [81159.56902647202, 454239.84958078514],
                  [81410.91253305555, 454371.1504976047],
                  [81674.87579105185, 454511.0797588613],
                  [81819.07263091723, 454611.68697220733],
                  [81866.12200739414, 454609.5278572415],
                  [82086.64105932834, 454798.537437202],
                  [82182.11032341822, 454888.12326411967],
                  [82172.15764762858, 454911.7482623105],
                  [82107.94995624608, 454997.80006609776],
                  [82051.61899110313, 455069.0617275663],
                  [81948.82514147912, 455207.0370952562],
                  [81744.43325837399, 455488.10128218227],
                  [81643.66802673275, 455637.78011831193],
                  [81602.93342632335, 455718.3452778475],
                  [81603.66874623756, 455718.3344310657],
                  [81573.06237012024, 455812.32079432247]
                ]
              ]
            }
          }
        },
        display_name: 'Impact Indicator',
        has_data: true,
        status: 'Done',
        last_modified: 1598965491,
        name: 'impact_indicator_test',
        type: 'impact_indicator',
        uuid: '842512e6-b016-40d2-9b9a-87e0625a0835'
      } as unknown) as DatasetWithData<T>);
    });
  }

  async getState<T>(params: {
    datasetUUID: UUID;
    scenarioUUID: UUID;
    entityGroup: string;
    properties: ComponentProperty[];
    timestamp: number;
  }): Promise<DatasetWithData<T> | null> {
    const { datasetUUID, scenarioUUID, entityGroup, properties, timestamp } = params;

    return await this.client.request(
      new GetScenarioState(datasetUUID, scenarioUUID, entityGroup, properties, timestamp)
    );
  }
}
