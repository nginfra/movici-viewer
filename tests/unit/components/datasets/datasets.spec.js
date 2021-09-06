import { mocked } from 'ts-jest/utils';
import Datasets from '@/components/datasets/Datasets.vue';
import DatasetsStore from '@/store/modules/DatasetsStore';
import ProjectStore from '@/store/modules/ProjectStore';
import { createComponentWrapper } from '../../helpers';

// eslint-disable-next-line
const datasetsData = require('../../../data/datasets.json'),
  // eslint-disable-next-line
  activeProjectData = require('../../../data/activeProject.json');

// mock store module, and stub actions that will be tested.
const mockedProjectStore = mocked(ProjectStore);

Object.assign(mocked(DatasetsStore, true), {
  getDatasets: async () => {
    return datasetsData.datasets;
  }
});

describe('Datasets Component', () => {
  let wrapper;
  const spy = {
    getDatasets: jest.spyOn(Datasets.options.methods, 'getDatasets')
  };

  beforeEach(() => {
    // best way so far to spy on module methods if they are called on mounted
    wrapper = createComponentWrapper(Datasets, {});

    mockedProjectStore.SET_ACTIVE_PROJECT(activeProjectData);
  });

  afterEach(() => {
    spy.getDatasets.mockClear();
  });

  it('get datasets on uuid change', async () => {
    expect(spy.getDatasets).toHaveBeenCalled();
    expect(wrapper.vm.datasets).toEqual(expect.arrayContaining(datasetsData.datasets));
  });

  it.each(['.table > tbody > tr > td a', '.table > tbody > tr > td .action-edit'])(
    'clicks  %s, then go to edit page of that item',
    async path => {
      await wrapper.find(path).trigger('click');
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: 'DatasetEdit',
        params: {
          uuid: '0001'
        }
      });
    }
  );
});
